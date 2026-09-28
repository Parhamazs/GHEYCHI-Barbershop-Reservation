package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gheychi/backend/internal/config"
	"github.com/gheychi/backend/internal/handler"
	"github.com/gheychi/backend/internal/middleware"
	"github.com/gheychi/backend/internal/repository/postgres"
	"github.com/gheychi/backend/internal/repository/redis"
	"github.com/gheychi/backend/internal/service"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	rdb "github.com/redis/go-redis/v9"
)

func main() {
	cfg := config.LoadConfig()

	log.Printf("[Gheychi API] Initializing backend services...")

	// 1. Initialize PostgreSQL Repository
	repo, err := postgres.NewRepository(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// 2. Initialize Redis Client
	redisClient := rdb.NewClient(&rdb.Options{
		Addr:     cfg.RedisAddr,
		Password: cfg.RedisPassword,
		DB:       cfg.RedisDB,
	})
	ctxPing, cancelPing := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancelPing()
	if err := redisClient.Ping(ctxPing).Err(); err != nil {
		log.Printf("[Warning] Redis connection test: %v (will retry on operations)", err)
	} else {
		log.Println("[Gheychi API] Redis connection verified successfully.")
	}

	lockRepo := redis.NewRedisLockRepo(redisClient)

	// 3. Initialize Services
	authService := service.NewAuthService(repo, cfg.JWTSecret, cfg.JWTRefreshSecret, cfg.JWTExpiryHours)
	barberService := service.NewBarberService(repo)
	bookingService := service.NewBookingService(repo, lockRepo)

	// 4. Initialize Handlers & Router
	h := handler.NewHandler(authService, barberService, bookingService)

	router := gin.Default()

	// CORS Setup
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health Check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":      "online",
			"system":      "Gheychi (قیچی) Barbershop Booking API",
			"time":        time.Now().UTC(),
			"environment": "production-ready",
		})
	})

	// Public Routes
	v1 := router.Group("/api/v1")
	{
		// Auth
		auth := v1.Group("/auth")
		{
			auth.POST("/register", h.Register)
			auth.POST("/login", h.Login)
			auth.POST("/refresh", h.RefreshToken)
		}

		// Barber Discovery & Profile (Public for Customers)
		v1.GET("/barbers/nearby", h.GetNearbyBarbers)
		v1.GET("/barbers/:id", h.GetBarberProfile)
		v1.GET("/barbers/:barber_id/slots", h.GetCustomerBarberSlots) // next 2 days only

		// Authenticated Routes
		authRequired := v1.Group("")
		authRequired.Use(middleware.AuthMiddleware(cfg.JWTSecret))
		{
			// Customer Booking & Redis 15-min Lock
			customerRoutes := authRequired.Group("/customer")
			customerRoutes.Use(middleware.RequireRole("customer"))
			{
				customerRoutes.POST("/slots/:slot_id/lock", h.LockSlot)              // Redis 15m hold
				customerRoutes.POST("/slots/:slot_id/pay", h.ConfirmPayment)         // Confirm payment -> green
				customerRoutes.POST("/slots/:slot_id/cancel", h.ExpireReservation)   // Cancel or expire hold
			}

			// Barber Dashboard & Schedules
			barberRoutes := authRequired.Group("/barber")
			barberRoutes.Use(middleware.RequireRole("barber"))
			{
				barberRoutes.GET("/profile/me", h.GetCurrentBarberProfile)
				barberRoutes.PUT("/profile/me", h.UpdateBarberProfile)
				barberRoutes.POST("/gallery", h.AddBarberImage)
				barberRoutes.DELETE("/gallery/:image_id", h.DeleteBarberImage)

				// Schedule Templates
				barberRoutes.POST("/templates", h.CreateScheduleTemplate)
				barberRoutes.GET("/templates", h.GetScheduleTemplates)
				barberRoutes.POST("/templates/apply", h.ApplyTemplateToDates)

				// Graphical Appointments Table
				barberRoutes.GET("/appointments", h.GetBarberAppointments)
				barberRoutes.POST("/appointments", h.CreateBarberSlot)
				barberRoutes.DELETE("/appointments/:slot_id", h.DeleteBarberSlot)
				barberRoutes.PATCH("/appointments/:slot_id/toggle-manual", h.ToggleManualReservation) // Yellow/White
			}
		}
	}

	// Graceful Server Shutdown
	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", cfg.Port),
		Handler: router,
	}

	go func() {
		log.Printf("[Gheychi API] Listening on port %s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Listen error: %s\n", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[Gheychi API] Shutting down server gracefully...")

	ctxShutdown, cancelShutdown := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancelShutdown()
	if err := server.Shutdown(ctxShutdown); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("[Gheychi API] Server exited cleanly.")
}
