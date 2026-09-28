package postgres

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/gheychi/backend/internal/domain"
	"github.com/gheychi/backend/internal/entity"
	"github.com/google/uuid"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(databaseURL string) (*Repository, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		PrepareStmt: true,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to postgres: %w", err)
	}

	sqlDB, err := db.DB()
	if err == nil {
		sqlDB.SetMaxOpenConns(50)
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetConnMaxLifetime(time.Hour)
	}

	return &Repository{db: db}, nil
}

func (r *Repository) DB() *gorm.DB {
	return r.db
}

// Transaction wrapper
func (r *Repository) WithTransaction(ctx context.Context, fn func(tx *gorm.DB) error) error {
	return r.db.WithContext(ctx).Transaction(fn)
}

// =================== USER REPOSITORY ===================

func (r *Repository) CreateUser(ctx context.Context, user *entity.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *Repository) GetUserByEmail(ctx context.Context, email string) (*entity.User, error) {
	var user entity.User
	err := r.db.WithContext(ctx).Preload("BarberProfile").Where("email = ?", email).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, domain.ErrUserNotFound
	}
	return &user, err
}

func (r *Repository) GetUserByID(ctx context.Context, id uuid.UUID) (*entity.User, error) {
	var user entity.User
	err := r.db.WithContext(ctx).Preload("BarberProfile").Where("id = ?", id).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, domain.ErrUserNotFound
	}
	return &user, err
}

// =================== BARBER REPOSITORY ===================

func (r *Repository) CreateBarberProfile(ctx context.Context, profile *entity.BarberProfile) error {
	return r.db.WithContext(ctx).Create(profile).Error
}

func (r *Repository) UpdateBarberProfile(ctx context.Context, profile *entity.BarberProfile) error {
	return r.db.WithContext(ctx).Save(profile).Error
}

func (r *Repository) GetBarberProfileByID(ctx context.Context, id uuid.UUID) (*entity.BarberProfile, error) {
	var profile entity.BarberProfile
	err := r.db.WithContext(ctx).Preload("Images", func(db *gorm.DB) *gorm.DB {
		return db.Order("display_order ASC")
	}).Where("id = ?", id).First(&profile).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, domain.ErrBarberNotFound
	}
	return &profile, err
}

func (r *Repository) GetBarberProfileByUserID(ctx context.Context, userID uuid.UUID) (*entity.BarberProfile, error) {
	var profile entity.BarberProfile
	err := r.db.WithContext(ctx).Preload("Images", func(db *gorm.DB) *gorm.DB {
		return db.Order("display_order ASC")
	}).Where("user_id = ?", userID).First(&profile).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, domain.ErrBarberNotFound
	}
	return &profile, err
}

// FindNearbyBarbers uses the Haversine formula to compute great-circle distance in kilometers:
// 6371 * acos(cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) + sin(radians(lat1)) * sin(radians(lat2)))
func (r *Repository) FindNearbyBarbers(ctx context.Context, lat, lng float64, radiusKm float64, limit int) ([]entity.BarberProfile, error) {
	if limit <= 0 {
		limit = 20
	}
	if radiusKm <= 0 {
		radiusKm = 50.0 // Default 50km search
	}

	haversineSQL := `
		6371 * acos(
			least(1.0, greatest(-1.0,
				cos(radians(?)) * cos(radians(latitude)) *
				cos(radians(longitude) - radians(?)) +
				sin(radians(?)) * sin(radians(latitude))
			))
		) AS distance_km
	`

	var barbers []entity.BarberProfile
	err := r.db.WithContext(ctx).
		Table("barber_profiles").
		Select("barber_profiles.*, " + haversineSQL, lat, lng, lat).
		Preload("Images", func(db *gorm.DB) *gorm.DB {
			return db.Order("display_order ASC")
		}).
		Where("is_active = true").
		Having(fmt.Sprintf("%s <= ?", haversineSQL), lat, lng, lat, radiusKm).
		Order("distance_km ASC").
		Limit(limit).
		Find(&barbers).Error

	return barbers, err
}

// AddBarberImage adds an image while enforcing the maximum 4 images constraint
func (r *Repository) AddBarberImage(ctx context.Context, image *entity.BarberImage) error {
	var count int64
	r.db.WithContext(ctx).Model(&entity.BarberImage{}).Where("barber_profile_id = ?", image.BarberProfileID).Count(&count)
	if count >= 4 {
		return domain.ErrMaxImagesExceeded
	}
	return r.db.WithContext(ctx).Create(image).Error
}

func (r *Repository) DeleteBarberImage(ctx context.Context, imageID, profileID uuid.UUID) error {
	return r.db.WithContext(ctx).Where("id = ? AND barber_profile_id = ?", imageID, profileID).Delete(&entity.BarberImage{}).Error
}

// =================== SCHEDULE TEMPLATE REPOSITORY ===================

func (r *Repository) CreateScheduleTemplate(ctx context.Context, template *entity.ScheduleTemplate) error {
	return r.db.WithContext(ctx).Create(template).Error
}

func (r *Repository) GetScheduleTemplates(ctx context.Context, profileID uuid.UUID) ([]entity.ScheduleTemplate, error) {
	var templates []entity.ScheduleTemplate
	err := r.db.WithContext(ctx).Preload("Slots", func(db *gorm.DB) *gorm.DB {
		return db.Order("start_time ASC")
	}).Where("barber_profile_id = ?", profileID).Find(&templates).Error
	return templates, err
}

// ApplyTemplateToDates generates daily appointments for specified dates using a template
func (r *Repository) ApplyTemplateToDates(ctx context.Context, profileID, templateID uuid.UUID, dates []string) error {
	var template entity.ScheduleTemplate
	if err := r.db.WithContext(ctx).Preload("Slots").Where("id = ? AND barber_profile_id = ?", templateID, profileID).First(&template).Error; err != nil {
		return domain.ErrTemplateNotFound
	}

	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		for _, dateStr := range dates {
			parsedDate, err := time.Parse("2006-01-02", dateStr)
			if err != nil {
				continue
			}

			// Ensure daily_schedules record
			var dailySchedule entity.DailySchedule
			if err := tx.Where("barber_profile_id = ? AND schedule_date = ?", profileID, parsedDate).FirstOrCreate(&dailySchedule, entity.DailySchedule{
				BarberProfileID: profileID,
				TemplateID:      &templateID,
				ScheduleDate:    parsedDate,
			}).Error; err != nil {
				return err
			}

			// Create appointments for each slot if not already present
			for _, slot := range template.Slots {
				var count int64
				tx.Model(&entity.Appointment{}).Where("barber_profile_id = ? AND slot_date = ? AND start_time = ?", profileID, dateStr, slot.StartTime).Count(&count)
				if count == 0 {
					newAppt := entity.Appointment{
						BarberProfileID: profileID,
						DailyScheduleID: &dailySchedule.ID,
						SlotDate:        dateStr,
						StartTime:       slot.StartTime,
						EndTime:         slot.EndTime,
						Status:          entity.StatusAvailable,
						ServiceName:     "Standard Haircut",
						Price:           25.00,
					}
					if err := tx.Create(&newAppt).Error; err != nil {
						return err
					}
				}
			}
		}
		return nil
	})
}

// =================== APPOINTMENT REPOSITORY ===================

func (r *Repository) GetAppointmentsByDateRange(ctx context.Context, profileID uuid.UUID, startDate, endDate string) ([]entity.Appointment, error) {
	var appointments []entity.Appointment
	err := r.db.WithContext(ctx).
		Preload("Customer").
		Where("barber_profile_id = ? AND slot_date >= ? AND slot_date <= ?", profileID, startDate, endDate).
		Order("slot_date ASC, start_time ASC").
		Find(&appointments).Error
	return appointments, err
}

func (r *Repository) GetAppointmentByID(ctx context.Context, id uuid.UUID) (*entity.Appointment, error) {
	var appt entity.Appointment
	err := r.db.WithContext(ctx).Preload("Customer").Where("id = ?", id).First(&appt).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, domain.ErrAppointmentNotFound
	}
	return &appt, err
}

func (r *Repository) CreateAppointment(ctx context.Context, appt *entity.Appointment) error {
	return r.db.WithContext(ctx).Create(appt).Error
}

func (r *Repository) DeleteAppointment(ctx context.Context, id, profileID uuid.UUID) error {
	// Only delete if available or if barber owns it
	return r.db.WithContext(ctx).Where("id = ? AND barber_profile_id = ?", id, profileID).Delete(&entity.Appointment{}).Error
}

// ToggleManualReservation allows barber to mark a slot as reserved_manual (Yellow) or release back to available (White)
func (r *Repository) ToggleManualReservation(ctx context.Context, id, profileID uuid.UUID, notes string) (*entity.Appointment, error) {
	var appt entity.Appointment
	err := r.db.WithContext(ctx).Where("id = ? AND barber_profile_id = ?", id, profileID).First(&appt).Error
	if err != nil {
		return nil, domain.ErrAppointmentNotFound
	}

	if appt.Status == entity.StatusReservedManual {
		// Release back to available (White)
		appt.Status = entity.StatusAvailable
		appt.ManualNotes = ""
	} else if appt.Status == entity.StatusAvailable {
		// Mark as reserved_manual (Yellow)
		appt.Status = entity.StatusReservedManual
		if notes == "" {
			notes = "Manual reservation (Phone/Walk-in)"
		}
		appt.ManualNotes = notes
		now := time.Now()
		appt.ReservedAt = &now
	} else {
		return nil, fmt.Errorf("cannot toggle slot with status: %s", appt.Status)
	}

	if err := r.db.WithContext(ctx).Save(&appt).Error; err != nil {
		return nil, err
	}
	return &appt, nil
}

// LockAppointmentForPayment updates the DB slot status with a concurrency lock (SELECT FOR UPDATE)
func (r *Repository) LockAppointmentForPayment(ctx context.Context, apptID, customerID uuid.UUID, lockExpiresAt time.Time) (*entity.Appointment, error) {
	var appt entity.Appointment
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Lock the row with SELECT FOR UPDATE
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("id = ?", apptID).First(&appt).Error; err != nil {
			return domain.ErrAppointmentNotFound
		}

		if appt.Status != entity.StatusAvailable {
			return domain.ErrSlotNotAvailable
		}

		appt.Status = entity.StatusPendingPayment
		appt.CustomerID = &customerID
		appt.LockExpiresAt = &lockExpiresAt
		return tx.Save(&appt).Error
	})

	if err != nil {
		return nil, err
	}
	return &appt, nil
}

// ConfirmPaymentReservation updates slot to reserved_paid (Green)
func (r *Repository) ConfirmPaymentReservation(ctx context.Context, apptID, customerID uuid.UUID) (*entity.Appointment, error) {
	var appt entity.Appointment
	err := r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).Where("id = ?", apptID).First(&appt).Error; err != nil {
			return domain.ErrAppointmentNotFound
		}

		if appt.Status != entity.StatusPendingPayment && appt.Status != entity.StatusAvailable {
			return domain.ErrSlotNotAvailable
		}

		now := time.Now()
		appt.Status = entity.StatusReservedPaid
		appt.CustomerID = &customerID
		appt.ReservedAt = &now
		appt.LockExpiresAt = nil

		// Record payment
		payment := entity.Payment{
			AppointmentID:  appt.ID,
			CustomerID:     customerID,
			Amount:         appt.Price,
			Currency:       "USD",
			Status:         entity.PaymentCompleted,
			TransactionRef: fmt.Sprintf("TXN-%d", time.Now().UnixNano()),
			PaymentMethod:  "credit_card",
		}
		if err := tx.Create(&payment).Error; err != nil {
			return err
		}

		return tx.Save(&appt).Error
	})

	if err != nil {
		return nil, err
	}
	return &appt, nil
}

// ReleaseExpiredSlot unlocks slot back to available if unpaid
func (r *Repository) ReleaseExpiredSlot(ctx context.Context, apptID uuid.UUID) error {
	return r.db.WithContext(ctx).Model(&entity.Appointment{}).
		Where("id = ? AND status = ?", apptID, entity.StatusPendingPayment).
		Updates(map[string]interface{}{
			"status":          entity.StatusAvailable,
			"customer_id":     nil,
			"lock_expires_at": nil,
		}).Error
}

// =================== REVIEWS ===================

func (r *Repository) CreateReview(ctx context.Context, review *entity.Review) error {
	return r.db.WithContext(ctx).Create(review).Error
}

func (r *Repository) GetReviewsByBarberID(ctx context.Context, barberID uuid.UUID) ([]entity.Review, error) {
	var reviews []entity.Review
	err := r.db.WithContext(ctx).Preload("Customer").Where("barber_profile_id = ?", barberID).Order("created_at DESC").Find(&reviews).Error
	return reviews, err
}
