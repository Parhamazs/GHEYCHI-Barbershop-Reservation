package service

import (
	"context"

	"github.com/gheychi/backend/internal/domain"
	"github.com/gheychi/backend/internal/entity"
	"github.com/gheychi/backend/internal/repository/postgres"
	"github.com/gheychi/backend/pkg/jwt"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo             *postgres.Repository
	jwtSecret        string
	jwtRefreshSecret string
	jwtExpiryHours   int
}

func NewAuthService(repo *postgres.Repository, jwtSecret, jwtRefreshSecret string, expiryHours int) *AuthService {
	return &AuthService{
		repo:             repo,
		jwtSecret:        jwtSecret,
		jwtRefreshSecret: jwtRefreshSecret,
		jwtExpiryHours:   expiryHours,
	}
}

type AuthResult struct {
	User   *entity.User   `json:"user"`
	Tokens *jwt.TokenPair `json:"tokens"`
}

func (s *AuthService) Register(ctx context.Context, email, password, fullName, phone string, role entity.UserRole) (*AuthResult, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &entity.User{
		Email:        email,
		PasswordHash: string(hashedPassword),
		FullName:     fullName,
		Phone:        phone,
		Role:         role,
	}

	if err := s.repo.CreateUser(ctx, user); err != nil {
		return nil, domain.ErrUserAlreadyExists
	}

	// If barber, create empty default profile
	if role == entity.RoleBarber {
		profile := &entity.BarberProfile{
			UserID:      user.ID,
			ShopName:    fullName + "'s Barbershop",
			PhoneNumber: phone,
			Address:     "Tehran, Iran",
			Latitude:    35.6892,
			Longitude:   51.3890,
			Services:    `["Haircut", "Beard Trim"]`,
		}
		_ = s.repo.CreateBarberProfile(ctx, profile)
		user.BarberProfile = profile
	}

	tokens, err := jwt.GenerateTokenPair(user.ID, string(user.Role), user.Email, s.jwtSecret, s.jwtRefreshSecret, s.jwtExpiryHours)
	if err != nil {
		return nil, err
	}

	return &AuthResult{
		User:   user,
		Tokens: tokens,
	}, nil
}

func (s *AuthService) Login(ctx context.Context, email, password string) (*AuthResult, error) {
	user, err := s.repo.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, domain.ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, domain.ErrInvalidCredentials
	}

	tokens, err := jwt.GenerateTokenPair(user.ID, string(user.Role), user.Email, s.jwtSecret, s.jwtRefreshSecret, s.jwtExpiryHours)
	if err != nil {
		return nil, err
	}

	return &AuthResult{
		User:   user,
		Tokens: tokens,
	}, nil
}

func (s *AuthService) RefreshToken(ctx context.Context, refreshToken string) (*jwt.TokenPair, error) {
	claims, err := jwt.ParseToken(refreshToken, s.jwtRefreshSecret)
	if err != nil {
		return nil, domain.ErrUnauthorized
	}

	user, err := s.repo.GetUserByID(ctx, claims.UserID)
	if err != nil {
		return nil, domain.ErrUserNotFound
	}

	return jwt.GenerateTokenPair(user.ID, string(user.Role), user.Email, s.jwtSecret, s.jwtRefreshSecret, s.jwtExpiryHours)
}
