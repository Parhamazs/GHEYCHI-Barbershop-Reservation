package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port              string
	DatabaseURL       string
	RedisAddr         string
	RedisPassword     string
	RedisDB           int
	JWTSecret         string
	JWTRefreshSecret  string
	JWTExpiryHours    int
	LockDurationMinutes int
}

func LoadConfig() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://gheychi_user:gheychi_secret@postgres:5432/gheychi_db?sslmode=disable"
	}

	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "redis:6379"
	}

	redisPassword := os.Getenv("REDIS_PASSWORD")

	redisDB := 0
	if dbStr := os.Getenv("REDIS_DB"); dbStr != "" {
		if val, err := strconv.Atoi(dbStr); err == nil {
			redisDB = val
		}
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "super-secret-gheychi-jwt-key-production-ready"
	}

	jwtRefreshSecret := os.Getenv("JWT_REFRESH_SECRET")
	if jwtRefreshSecret == "" {
		jwtRefreshSecret = "super-secret-gheychi-refresh-key-production-ready"
	}

	jwtExpiryHours := 24
	if expStr := os.Getenv("JWT_EXPIRY_HOURS"); expStr != "" {
		if val, err := strconv.Atoi(expStr); err == nil {
			jwtExpiryHours = val
		}
	}

	return &Config{
		Port:                port,
		DatabaseURL:         dbURL,
		RedisAddr:           redisAddr,
		RedisPassword:       redisPassword,
		RedisDB:             redisDB,
		JWTSecret:           jwtSecret,
		JWTRefreshSecret:    jwtRefreshSecret,
		JWTExpiryHours:      jwtExpiryHours,
		LockDurationMinutes: 15, // Fixed 15-minute business rule
	}
}
