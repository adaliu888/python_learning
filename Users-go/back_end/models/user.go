package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID                uint           `json:"id" gorm:"primaryKey"`
	Username          string         `json:"username" gorm:"uniqueIndex;not null;size:30"`
	Email             string         `json:"email" gorm:"uniqueIndex;not null"`
	Password          string         `json:"-" gorm:"not null"`
	FirstName         string         `json:"firstName" gorm:"size:50;not null"`
	LastName          string         `json:"lastName" gorm:"size:50;not null"`
	Phone             *string        `json:"phone" gorm:"size:20"`
	DateOfBirth       *time.Time     `json:"dateOfBirth"`
	Bio               *string        `json:"bio" gorm:"size:500"`
	Role              string         `json:"role" gorm:"default:'user';size:20"`
	Status            string         `json:"status" gorm:"default:'pending_verification';size:20"`
	EmailVerified     bool           `json:"emailVerified" gorm:"default:false"`
	EmailVerifiedAt   *time.Time     `json:"emailVerifiedAt"`
	LastLoginAt       *time.Time     `json:"lastLoginAt"`
	PasswordChangedAt *time.Time     `json:"passwordChangedAt"`
	CreatedAt         time.Time      `json:"createdAt"`
	UpdatedAt         time.Time      `json:"updatedAt"`
	DeletedAt         gorm.DeletedAt `json:"-" gorm:"index"`
}

type UserRegistration struct {
	Username        string `json:"username" binding:"required,min=3,max=30,alphanum"`
	Email           string `json:"email" binding:"required,email"`
	Password        string `json:"password" binding:"required,min=8,max=128"`
	ConfirmPassword string `json:"confirmPassword" binding:"required"`
	FirstName       string `json:"firstName" binding:"required,min=1,max=50"`
	LastName        string `json:"lastName" binding:"required,min=1,max=50"`
	Phone           string `json:"phone" binding:"omitempty"`
	DateOfBirth     string `json:"dateOfBirth" binding:"omitempty"`
	AcceptTerms     bool   `json:"acceptTerms" binding:"required"`
}

type UserLogin struct {
	Email      string `json:"email" binding:"omitempty,email"`
	Username   string `json:"username" binding:"omitempty"`
	Password   string `json:"password" binding:"required"`
	RememberMe bool   `json:"rememberMe"`
}

type UserProfile struct {
	FirstName   string `json:"firstName" binding:"omitempty,min=1,max=50"`
	LastName    string `json:"lastName" binding:"omitempty,min=1,max=50"`
	Phone       string `json:"phone" binding:"omitempty,e164"`
	DateOfBirth string `json:"dateOfBirth" binding:"omitempty,datetime=2006-01-02"`
	Bio         string `json:"bio" binding:"omitempty,max=500"`
}

type ChangePassword struct {
	CurrentPassword string `json:"currentPassword" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required,min=8,max=128"`
	ConfirmPassword string `json:"confirmPassword" binding:"required"`
}

type EmailVerification struct {
	Token string `json:"token" binding:"required"`
}

type ForgotPassword struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPassword struct {
	Token           string `json:"token" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required,min=8,max=128"`
	ConfirmPassword string `json:"confirmPassword" binding:"required"`
}

type RefreshToken struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

type TokenBlacklist struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	Token     string    `json:"token" gorm:"uniqueIndex;not null"`
	ExpiresAt time.Time `json:"expiresAt" gorm:"not null"`
	CreatedAt time.Time `json:"createdAt"`
}

type EmailVerificationToken struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"userId" gorm:"not null"`
	Token     string    `json:"token" gorm:"uniqueIndex;not null"`
	ExpiresAt time.Time `json:"expiresAt" gorm:"not null"`
	Used      bool      `json:"used" gorm:"default:false"`
	CreatedAt time.Time `json:"createdAt"`
}

type PasswordResetToken struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UserID    uint      `json:"userId" gorm:"not null"`
	Token     string    `json:"token" gorm:"uniqueIndex;not null"`
	ExpiresAt time.Time `json:"expiresAt" gorm:"not null"`
	Used      bool      `json:"used" gorm:"default:false"`
	CreatedAt time.Time `json:"createdAt"`
} 