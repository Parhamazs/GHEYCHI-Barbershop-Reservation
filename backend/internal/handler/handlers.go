package handler

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gheychi/backend/internal/entity"
	"github.com/gheychi/backend/internal/middleware"
	"github.com/gheychi/backend/internal/service"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Handler struct {
	authService    *service.AuthService
	barberService  *service.BarberService
	bookingService *service.BookingService
}

func NewHandler(authService *service.AuthService, barberService *service.BarberService, bookingService *service.BookingService) *Handler {
	return &Handler{
		authService:    authService,
		barberService:  barberService,
		bookingService: bookingService,
	}
}

// =================== AUTH HANDLERS ===================

type RegisterInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name" binding:"required"`
	Phone    string `json:"phone" binding:"required"`
	Role     string `json:"role" binding:"required,oneof=customer barber"`
}

func (h *Handler) Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.authService.Register(c.Request.Context(), input.Email, input.Password, input.FullName, input.Phone, entity.UserRole(input.Role))
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": result})
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (h *Handler) Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.authService.Login(c.Request.Context(), input.Email, input.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": result})
}

func (h *Handler) RefreshToken(c *gin.Context) {
	var body struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokens, err := h.authService.RefreshToken(c.Request.Context(), body.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": tokens})
}

// =================== BARBER PROFILE & DISCOVERY ===================

func (h *Handler) GetNearbyBarbers(c *gin.Context) {
	latStr := c.DefaultQuery("lat", "35.6892")
	lngStr := c.DefaultQuery("lng", "51.3890")
	radiusStr := c.DefaultQuery("radius_km", "50")

	lat, err1 := strconv.ParseFloat(latStr, 64)
	lng, err2 := strconv.ParseFloat(lngStr, 64)
	radius, _ := strconv.ParseFloat(radiusStr, 64)

	if err1 != nil || err2 != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid latitude or longitude format"})
		return
	}

	barbers, err := h.barberService.FindNearby(c.Request.Context(), lat, lng, radius, 30)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to search nearby barbers: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": barbers})
}

func (h *Handler) GetBarberProfile(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid barber profile id"})
		return
	}

	profile, err := h.barberService.GetProfile(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": profile})
}

func (h *Handler) GetCurrentBarberProfile(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found for user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": profile})
}

func (h *Handler) UpdateBarberProfile(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found"})
		return
	}

	var input struct {
		ShopName            string  `json:"shop_name"`
		Bio                 string  `json:"bio"`
		PhoneNumber         string  `json:"phone_number"`
		Address             string  `json:"address"`
		Latitude            float64 `json:"latitude"`
		Longitude           float64 `json:"longitude"`
		WorkingHoursStart   string  `json:"working_hours_start"`
		WorkingHoursEnd     string  `json:"working_hours_end"`
		SlotDurationMinutes int     `json:"slot_duration_minutes"`
		PricePerSlot        float64 `json:"price_per_slot"`
		Services            string  `json:"services"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.ShopName != "" {
		profile.ShopName = input.ShopName
	}
	profile.Bio = input.Bio
	if input.PhoneNumber != "" {
		profile.PhoneNumber = input.PhoneNumber
	}
	if input.Address != "" {
		profile.Address = input.Address
	}
	if input.Latitude != 0 {
		profile.Latitude = input.Latitude
	}
	if input.Longitude != 0 {
		profile.Longitude = input.Longitude
	}
	if input.WorkingHoursStart != "" {
		profile.WorkingHoursStart = input.WorkingHoursStart
	}
	if input.WorkingHoursEnd != "" {
		profile.WorkingHoursEnd = input.WorkingHoursEnd
	}
	if input.SlotDurationMinutes > 0 {
		profile.SlotDurationMinutes = input.SlotDurationMinutes
	}
	if input.PricePerSlot > 0 {
		profile.PricePerSlot = input.PricePerSlot
	}
	if input.Services != "" {
		profile.Services = input.Services
	}

	if err := h.barberService.UpdateProfile(c.Request.Context(), profile); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": profile})
}

// AddImage - enforces maximum 4 images
func (h *Handler) AddBarberImage(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found"})
		return
	}

	var input struct {
		ImageURL string `json:"image_url" binding:"required"`
		Caption  string `json:"caption"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	img, err := h.barberService.AddGalleryImage(c.Request.Context(), profile.ID, input.ImageURL, input.Caption)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": img})
}

func (h *Handler) DeleteBarberImage(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found"})
		return
	}

	imageID, err := uuid.Parse(c.Param("image_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid image id"})
		return
	}

	if err := h.barberService.DeleteGalleryImage(c.Request.Context(), imageID, profile.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "image deleted successfully"})
}

// =================== SCHEDULE TEMPLATES ===================

func (h *Handler) CreateScheduleTemplate(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found"})
		return
	}

	var input struct {
		Name  string `json:"name" binding:"required"`
		Slots []struct {
			StartTime string `json:"start_time" binding:"required"`
			EndTime   string `json:"end_time" binding:"required"`
		} `json:"slots" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	template := entity.ScheduleTemplate{
		BarberProfileID: profile.ID,
		Name:            input.Name,
	}
	for _, s := range input.Slots {
		template.Slots = append(template.Slots, entity.ScheduleTemplateSlot{
			StartTime: s.StartTime,
			EndTime:   s.EndTime,
		})
	}

	if err := h.barberService.CreateTemplate(c.Request.Context(), &template); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": template})
}

func (h *Handler) GetScheduleTemplates(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found"})
		return
	}

	templates, err := h.barberService.GetTemplates(c.Request.Context(), profile.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": templates})
}

func (h *Handler) ApplyTemplateToDates(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found"})
		return
	}

	var input struct {
		TemplateID string   `json:"template_id" binding:"required"`
		Dates      []string `json:"dates" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	templateUUID, err := uuid.Parse(input.TemplateID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid template id"})
		return
	}

	if err := h.barberService.ApplyTemplate(c.Request.Context(), profile.ID, templateUUID, input.Dates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Template successfully applied to specified dates"})
}

// =================== APPOINTMENTS & BOOKING ===================

// Customer: View available slots for next 2 days only
func (h *Handler) GetCustomerBarberSlots(c *gin.Context) {
	barberID, err := uuid.Parse(c.Param("barber_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid barber id"})
		return
	}

	slots, err := h.bookingService.GetBarberScheduleForCustomer(c.Request.Context(), barberID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": slots})
}

// Customer: Hold/Lock slot for 15 minutes in Redis
func (h *Handler) LockSlot(c *gin.Context) {
	customerID, _ := middleware.GetAuthUserID(c)
	slotID, err := uuid.Parse(c.Param("slot_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid slot id"})
		return
	}

	appt, err := h.bookingService.LockSlotTemporarily(c.Request.Context(), slotID, customerID)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Slot held for 15 minutes. Please complete payment before expiration.",
		"data":    appt,
		"expires_in_seconds": 900,
	})
}

// Customer: Mock Payment Confirm (marks as reserved_paid / Green)
func (h *Handler) ConfirmPayment(c *gin.Context) {
	customerID, _ := middleware.GetAuthUserID(c)
	slotID, err := uuid.Parse(c.Param("slot_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid slot id"})
		return
	}

	appt, err := h.bookingService.ConfirmPayment(c.Request.Context(), slotID, customerID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
			"warning": "Please complete your payment.",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Payment confirmed! Reservation is finalized.",
		"data":    appt,
	})
}

// Customer/System: Cancel or expire unpaid reservation
func (h *Handler) ExpireReservation(c *gin.Context) {
	customerID, _ := middleware.GetAuthUserID(c)
	slotID, err := uuid.Parse(c.Param("slot_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid slot id"})
		return
	}

	_ = h.bookingService.CancelOrExpireReservation(c.Request.Context(), slotID, customerID)
	c.JSON(http.StatusOK, gin.H{
		"message": "Reservation lock released.",
		"warning": "Please complete your payment. Your 15-minute reservation hold has expired.",
	})
}

// Barber: Graphical table appointments
func (h *Handler) GetBarberAppointments(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found"})
		return
	}

	date := c.DefaultQuery("date", time.Now().Format("2006-01-02"))
	appts, err := h.barberService.GetBarberAppointments(c.Request.Context(), profile.ID, date)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": appts})
}

// Barber: Create individual slot
func (h *Handler) CreateBarberSlot(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found"})
		return
	}

	var input struct {
		Date        string  `json:"date" binding:"required"`
		StartTime   string  `json:"start_time" binding:"required"`
		EndTime     string  `json:"end_time" binding:"required"`
		ServiceName string  `json:"service_name"`
		Price       float64 `json:"price"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.ServiceName == "" {
		input.ServiceName = "Standard Haircut"
	}
	if input.Price <= 0 {
		input.Price = profile.PricePerSlot
	}

	appt, err := h.barberService.CreateSlot(c.Request.Context(), profile.ID, input.Date, input.StartTime, input.EndTime, input.ServiceName, input.Price)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": appt})
}

// Barber: Delete individual slot
func (h *Handler) DeleteBarberSlot(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found"})
		return
	}

	slotID, err := uuid.Parse(c.Param("slot_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid slot id"})
		return
	}

	if err := h.barberService.DeleteSlot(c.Request.Context(), slotID, profile.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Slot deleted successfully"})
}

// Barber: Toggle Manual Reservation (Yellow / reserved_manual for phone/walk-in)
func (h *Handler) ToggleManualReservation(c *gin.Context) {
	userID, _ := middleware.GetAuthUserID(c)
	profile, err := h.barberService.GetProfileByUserID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "barber profile not found"})
		return
	}

	slotID, err := uuid.Parse(c.Param("slot_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid slot id"})
		return
	}

	var input struct {
		Notes string `json:"notes"`
	}
	_ = c.ShouldBindJSON(&input)

	appt, err := h.bookingService.BarberToggleManualSlot(c.Request.Context(), slotID, profile.ID, input.Notes)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Manual reservation status updated",
		"data":    appt,
	})
}
