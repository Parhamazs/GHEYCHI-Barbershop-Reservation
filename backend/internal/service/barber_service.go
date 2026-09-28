package service

import (
	"context"
	"time"

	"github.com/gheychi/backend/internal/domain"
	"github.com/gheychi/backend/internal/entity"
	"github.com/gheychi/backend/internal/repository/postgres"
	"github.com/google/uuid"
)

type BarberService struct {
	repo *postgres.Repository
}

func NewBarberService(repo *postgres.Repository) *BarberService {
	return &BarberService{repo: repo}
}

func (s *BarberService) GetProfile(ctx context.Context, id uuid.UUID) (*entity.BarberProfile, error) {
	return s.repo.GetBarberProfileByID(ctx, id)
}

func (s *BarberService) GetProfileByUserID(ctx context.Context, userID uuid.UUID) (*entity.BarberProfile, error) {
	return s.repo.GetBarberProfileByUserID(ctx, userID)
}

func (s *BarberService) UpdateProfile(ctx context.Context, profile *entity.BarberProfile) error {
	return s.repo.UpdateBarberProfile(ctx, profile)
}

func (s *BarberService) FindNearby(ctx context.Context, lat, lng float64, radiusKm float64, limit int) ([]entity.BarberProfile, error) {
	return s.repo.FindNearbyBarbers(ctx, lat, lng, radiusKm, limit)
}

// AddGalleryImage enforces maximum 4 images constraint
func (s *BarberService) AddGalleryImage(ctx context.Context, profileID uuid.UUID, imageURL, caption string) (*entity.BarberImage, error) {
	img := &entity.BarberImage{
		BarberProfileID: profileID,
		ImageURL:        imageURL,
		Caption:         caption,
	}
	if err := s.repo.AddBarberImage(ctx, img); err != nil {
		return nil, err
	}
	return img, nil
}

func (s *BarberService) DeleteGalleryImage(ctx context.Context, imageID, profileID uuid.UUID) error {
	return s.repo.DeleteBarberImage(ctx, imageID, profileID)
}

// Schedule Templates
func (s *BarberService) CreateTemplate(ctx context.Context, template *entity.ScheduleTemplate) error {
	return s.repo.CreateScheduleTemplate(ctx, template)
}

func (s *BarberService) GetTemplates(ctx context.Context, profileID uuid.UUID) ([]entity.ScheduleTemplate, error) {
	return s.repo.GetScheduleTemplates(ctx, profileID)
}

func (s *BarberService) ApplyTemplate(ctx context.Context, profileID, templateID uuid.UUID, dates []string) error {
	return s.repo.ApplyTemplateToDates(ctx, profileID, templateID, dates)
}

// Appointment management by Barber
func (s *BarberService) GetBarberAppointments(ctx context.Context, profileID uuid.UUID, date string) ([]entity.Appointment, error) {
	return s.repo.GetAppointmentsByDateRange(ctx, profileID, date, date)
}

func (s *BarberService) CreateSlot(ctx context.Context, profileID uuid.UUID, date, startTime, endTime string, serviceName string, price float64) (*entity.Appointment, error) {
	parsedStart, err1 := time.Parse("15:04:05", startTime)
	if err1 != nil {
		parsedStart, _ = time.Parse("15:04", startTime)
	}
	parsedEnd, err2 := time.Parse("15:04:05", endTime)
	if err2 != nil {
		parsedEnd, _ = time.Parse("15:04", endTime)
	}
	if !parsedEnd.After(parsedStart) {
		return nil, domain.ErrInvalidTimeRange
	}

	appt := &entity.Appointment{
		BarberProfileID: profileID,
		SlotDate:        date,
		StartTime:       startTime,
		EndTime:         endTime,
		Status:          entity.StatusAvailable,
		ServiceName:     serviceName,
		Price:           price,
	}
	if err := s.repo.CreateAppointment(ctx, appt); err != nil {
		return nil, err
	}
	return appt, nil
}

func (s *BarberService) DeleteSlot(ctx context.Context, slotID, profileID uuid.UUID) error {
	return s.repo.DeleteAppointment(ctx, slotID, profileID)
}
