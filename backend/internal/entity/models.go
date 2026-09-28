package entity

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRole string

const (
	RoleBarber   UserRole = "barber"
	RoleCustomer UserRole = "customer"
	RoleAdmin    UserRole = "admin"
)

type AppointmentStatus string

const (
	StatusAvailable      AppointmentStatus = "available"       // White in UI
	StatusPendingPayment AppointmentStatus = "pending_payment" // Temporary Redis lock (15m hold)
	StatusReservedPaid   AppointmentStatus = "reserved_paid"   // Green in UI
	StatusReservedManual AppointmentStatus = "reserved_manual" // Yellow in UI (phone/walk-in)
	StatusCancelled      AppointmentStatus = "cancelled"
)

type PaymentStatus string

const (
	PaymentPending   PaymentStatus = "pending"
	PaymentCompleted PaymentStatus = "completed"
	PaymentFailed    PaymentStatus = "failed"
	PaymentRefunded  PaymentStatus = "refunded"
)

// User represents a system user (Barber or Customer)
type User struct {
	ID           uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	Email        string    `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"not null" json:"-"`
	FullName     string    `gorm:"not null" json:"full_name"`
	Phone        string    `gorm:"uniqueIndex;not null" json:"phone"`
	Role         UserRole  `gorm:"type:varchar(20);not null;default:'customer'" json:"role"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`

	BarberProfile *BarberProfile `gorm:"foreignKey:UserID" json:"barber_profile,omitempty"`
}

// BarberProfile holds shop details, geolocation, and settings
type BarberProfile struct {
	ID                  uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID              uuid.UUID `gorm:"type:uuid;uniqueIndex;not null" json:"user_id"`
	ShopName            string    `gorm:"not null" json:"shop_name"`
	Bio                 string    `json:"bio"`
	PhoneNumber         string    `gorm:"not null" json:"phone_number"`
	Address             string    `gorm:"not null" json:"address"`
	Latitude            float64   `gorm:"not null;index" json:"latitude"`
	Longitude           float64   `gorm:"not null;index" json:"longitude"`
	WorkingHoursStart   string    `gorm:"default:'09:00:00'" json:"working_hours_start"`
	WorkingHoursEnd     string    `gorm:"default:'21:00:00'" json:"working_hours_end"`
	SlotDurationMinutes int       `gorm:"default:30" json:"slot_duration_minutes"`
	PricePerSlot        float64   `gorm:"type:numeric(10,2);default:25.00" json:"price_per_slot"`
	Services            string    `gorm:"type:jsonb;default:'[\"Haircut\", \"Beard Trim\"]'" json:"services"`
	IsActive            bool      `gorm:"default:true" json:"is_active"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`

	Images    []BarberImage `gorm:"foreignKey:BarberProfileID;constraint:OnDelete:CASCADE" json:"images,omitempty"`
	Distance  float64       `gorm:"-" json:"distance_km,omitempty"` // Computed at runtime
	RatingAvg float64       `gorm:"-" json:"rating_avg,omitempty"`
}

// BarberImage enforces MAX 4 images per profile
type BarberImage struct {
	ID              uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	BarberProfileID uuid.UUID `gorm:"type:uuid;not null;index" json:"barber_profile_id"`
	ImageURL        string    `gorm:"not null" json:"image_url"`
	Caption         string    `json:"caption"`
	DisplayOrder    int       `gorm:"default:0" json:"display_order"`
	CreatedAt       time.Time `json:"created_at"`
}

// ScheduleTemplate represents a reusable daily slot blueprint
type ScheduleTemplate struct {
	ID              uuid.UUID              `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	BarberProfileID uuid.UUID              `gorm:"type:uuid;not null;index" json:"barber_profile_id"`
	Name            string                 `gorm:"not null" json:"name"`
	IsDefault       bool                   `gorm:"default:false" json:"is_default"`
	CreatedAt       time.Time              `json:"created_at"`
	UpdatedAt       time.Time              `json:"updated_at"`
	Slots           []ScheduleTemplateSlot `gorm:"foreignKey:TemplateID;constraint:OnDelete:CASCADE" json:"slots,omitempty"`
}

// ScheduleTemplateSlot is a time slot within a template
type ScheduleTemplateSlot struct {
	ID         uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	TemplateID uuid.UUID `gorm:"type:uuid;not null;index" json:"template_id"`
	StartTime  string    `gorm:"type:time;not null" json:"start_time"` // "09:00:00"
	EndTime    string    `gorm:"type:time;not null" json:"end_time"`   // "09:30:00"
	CreatedAt  time.Time `json:"created_at"`
}

// DailySchedule links a calendar date to a template
type DailySchedule struct {
	ID              uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	BarberProfileID uuid.UUID  `gorm:"type:uuid;not null" json:"barber_profile_id"`
	TemplateID      *uuid.UUID `gorm:"type:uuid" json:"template_id,omitempty"`
	ScheduleDate    time.Time  `gorm:"type:date;not null" json:"schedule_date"`
	IsDayOff        bool       `gorm:"default:false" json:"is_day_off"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

// Appointment represents an individual booking time slot
type Appointment struct {
	ID              uuid.UUID         `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	BarberProfileID uuid.UUID         `gorm:"type:uuid;not null;index" json:"barber_profile_id"`
	DailyScheduleID *uuid.UUID        `gorm:"type:uuid" json:"daily_schedule_id,omitempty"`
	CustomerID      *uuid.UUID        `gorm:"type:uuid;index" json:"customer_id,omitempty"`
	SlotDate        string            `gorm:"type:date;not null;index" json:"slot_date"` // YYYY-MM-DD
	StartTime       string            `gorm:"type:time;not null" json:"start_time"`     // HH:MM:SS
	EndTime         string            `gorm:"type:time;not null" json:"end_time"`       // HH:MM:SS
	Status          AppointmentStatus `gorm:"type:varchar(30);not null;default:'available'" json:"status"`
	ManualNotes     string            `json:"manual_notes,omitempty"`                   // Phone/in-person reservation note
	ServiceName     string            `gorm:"default:'Standard Haircut'" json:"service_name"`
	Price           float64           `gorm:"type:numeric(10,2);default:25.00" json:"price"`
	LockExpiresAt   *time.Time        `json:"lock_expires_at,omitempty"`
	ReservedAt      *time.Time        `json:"reserved_at,omitempty"`
	CreatedAt       time.Time         `json:"created_at"`
	UpdatedAt       time.Time         `json:"updated_at"`

	Customer *User `gorm:"foreignKey:CustomerID" json:"customer,omitempty"`
}

// Payment tracks payment attempts
type Payment struct {
	ID             uuid.UUID     `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	AppointmentID  uuid.UUID     `gorm:"type:uuid;not null;index" json:"appointment_id"`
	CustomerID     uuid.UUID     `gorm:"type:uuid;not null;index" json:"customer_id"`
	Amount         float64       `gorm:"type:numeric(10,2);not null" json:"amount"`
	Currency       string        `gorm:"default:'USD'" json:"currency"`
	Status         PaymentStatus `gorm:"type:varchar(20);not null;default:'pending'" json:"status"`
	TransactionRef string        `json:"transaction_ref"`
	PaymentMethod  string        `gorm:"default:'credit_card'" json:"payment_method"`
	CreatedAt      time.Time     `json:"created_at"`
	UpdatedAt      time.Time     `json:"updated_at"`
}

// Review represents comments left by customers
type Review struct {
	ID              uuid.UUID `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	BarberProfileID uuid.UUID `gorm:"type:uuid;not null;index" json:"barber_profile_id"`
	CustomerID      uuid.UUID `gorm:"type:uuid;not null" json:"customer_id"`
	Rating          int       `gorm:"not null" json:"rating"` // 1 - 5
	Comment         string    `gorm:"not null" json:"comment"`
	CreatedAt       time.Time `json:"created_at"`

	Customer *User `gorm:"foreignKey:CustomerID" json:"customer,omitempty"`
}

// BeforeCreate validation hooks
func (b *BarberProfile) BeforeCreate(tx *gorm.DB) (err error) {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return
}
