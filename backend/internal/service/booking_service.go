package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/gheychi/backend/internal/domain"
	"github.com/gheychi/backend/internal/entity"
	"github.com/gheychi/backend/internal/repository/postgres"
	"github.com/gheychi/backend/internal/repository/redis"
	"github.com/google/uuid"
)

type BookingService struct {
	repo     *postgres.Repository
	lockRepo redis.LockRepository
}

func NewBookingService(repo *postgres.Repository, lockRepo redis.LockRepository) *BookingService {
	return &BookingService{
		repo:     repo,
		lockRepo: lockRepo,
	}
}

// GetBarberScheduleForCustomer retrieves slots for the next 2 days only (Today & Tomorrow)
func (s *BookingService) GetBarberScheduleForCustomer(ctx context.Context, barberID uuid.UUID) ([]entity.Appointment, error) {
	today := time.Now().Format("2006-01-02")
	tomorrow := time.Now().AddDate(0, 0, 1).Format("2006-01-02")

	appts, err := s.repo.GetAppointmentsByDateRange(ctx, barberID, today, tomorrow)
	if err != nil {
		return nil, err
	}

	// For each slot, check Redis lock state to verify active hold
	for i := range appts {
		if appts[i].Status == entity.StatusPendingPayment {
			// Check if lock expired in Redis
			owner, ttl, err := s.lockRepo.GetLockOwner(ctx, appts[i].ID.String())
			if err != nil || ttl <= 0 || owner == "" {
				// Expired! Release back in DB
				_ = s.repo.ReleaseExpiredSlot(ctx, appts[i].ID)
				appts[i].Status = entity.StatusAvailable
				appts[i].CustomerID = nil
			}
		}
	}

	return appts, nil
}

// LockSlotTemporarily initiates the 15-minute reservation hold
func (s *BookingService) LockSlotTemporarily(ctx context.Context, slotID uuid.UUID, customerID uuid.UUID) (*entity.Appointment, error) {
	// 1. Fetch appointment to validate date constraint (must be within next 2 days)
	appt, err := s.repo.GetAppointmentByID(ctx, slotID)
	if err != nil {
		return nil, domain.ErrAppointmentNotFound
	}

	today := time.Now().Format("2006-01-02")
	dayAfterTomorrow := time.Now().AddDate(0, 0, 2).Format("2006-01-02")
	if appt.SlotDate < today || appt.SlotDate >= dayAfterTomorrow {
		return nil, domain.ErrDateBeyondAllowed
	}

	if appt.Status != entity.StatusAvailable {
		return nil, domain.ErrSlotNotAvailable
	}

	// 2. Acquire Redis distributed lock with 15-minute TTL (SET NX EX 900)
	acquired, err := s.lockRepo.AcquireSlotLock(ctx, slotID.String(), customerID.String())
	if err != nil {
		return nil, fmt.Errorf("redis lock error: %w", err)
	}
	if !acquired {
		return nil, domain.ErrSlotLocked
	}

	// 3. Update PostgreSQL record inside transaction (SELECT FOR UPDATE)
	lockExpiresAt := time.Now().Add(15 * time.Minute)
	lockedAppt, err := s.repo.LockAppointmentForPayment(ctx, slotID, customerID, lockExpiresAt)
	if err != nil {
		// Rollback Redis lock on DB failure
		_ = s.lockRepo.ReleaseSlotLock(ctx, slotID.String(), customerID.String())
		return nil, err
	}

	return lockedAppt, nil
}

// ConfirmPayment finalizes the reservation to reserved_paid (Green)
func (s *BookingService) ConfirmPayment(ctx context.Context, slotID uuid.UUID, customerID uuid.UUID) (*entity.Appointment, error) {
	// 1. Check Redis lock ownership
	owner, ttl, err := s.lockRepo.GetLockOwner(ctx, slotID.String())
	if err != nil || owner != customerID.String() || ttl <= 0 {
		// Released or expired!
		_ = s.repo.ReleaseExpiredSlot(ctx, slotID)
		return nil, errors.New("Please complete your payment. Your 15-minute reservation hold has expired.")
	}

	// 2. Update PostgreSQL row to reserved_paid
	confirmedAppt, err := s.repo.ConfirmPaymentReservation(ctx, slotID, customerID)
	if err != nil {
		return nil, err
	}

	// 3. Release Redis temporary hold lock (since now confirmed in PostgreSQL)
	_ = s.lockRepo.ReleaseSlotLock(ctx, slotID.String(), customerID.String())

	return confirmedAppt, nil
}

// CancelOrExpireReservation releases slot back to available
func (s *BookingService) CancelOrExpireReservation(ctx context.Context, slotID uuid.UUID, customerID uuid.UUID) error {
	_ = s.lockRepo.ReleaseSlotLock(ctx, slotID.String(), customerID.String())
	return s.repo.ReleaseExpiredSlot(ctx, slotID)
}

// BarberToggleManualSlot allows barber to mark a phone/in-person reservation (Yellow)
func (s *BookingService) BarberToggleManualSlot(ctx context.Context, slotID uuid.UUID, barberProfileID uuid.UUID, notes string) (*entity.Appointment, error) {
	return s.repo.ToggleManualReservation(ctx, slotID, barberProfileID, notes)
}
