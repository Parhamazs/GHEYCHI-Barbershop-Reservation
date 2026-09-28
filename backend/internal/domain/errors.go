package domain

import "errors"

var (
	ErrUserNotFound          = errors.New("user not found")
	ErrInvalidCredentials    = errors.New("invalid email or password")
	ErrUserAlreadyExists     = errors.New("user with this email or phone already exists")
	ErrUnauthorized          = errors.New("unauthorized")
	ErrForbidden             = errors.New("forbidden: insufficient permissions")
	ErrBarberNotFound        = errors.New("barber profile not found")
	ErrMaxImagesExceeded     = errors.New("maximum 4 images allowed per barber profile")
	ErrAppointmentNotFound   = errors.New("appointment slot not found")
	ErrSlotNotAvailable      = errors.New("slot is not available for reservation")
	ErrSlotLocked            = errors.New("slot is temporarily held by another customer (15 min payment window)")
	ErrDateBeyondAllowed     = errors.New("customers can only view and reserve slots for the next 2 days")
	ErrPaymentFailed         = errors.New("payment processing failed")
	ErrPaymentExpired        = errors.New("payment window expired (15 minutes limit exceeded)")
	ErrTemplateNotFound      = errors.New("schedule template not found")
	ErrInvalidTimeRange      = errors.New("end time must be strictly after start time")
)
