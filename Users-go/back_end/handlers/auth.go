package handlers

import (
	"net/http"
	"strings"
	"time"

	"newworld-project/database"
	"newworld-project/models"
	"newworld-project/utils"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct{}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{}
}

// Register handles user registration
func (h *AuthHandler) Register(c *gin.Context) {
	var req models.UserRegistration
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Validation failed",
			"errors":  getValidationErrors(err),
		})
		return
	}

	// Check if passwords match
	if req.Password != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Passwords do not match",
			"errors": []gin.H{
				{
					"field":   "confirmPassword",
					"message": "Passwords do not match",
				},
			},
		})
		return
	}

	// Check password strength
	if len(req.Password) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Password must be at least 8 characters long",
			"errors": []gin.H{
				{
					"field":   "password",
					"message": "Password must be at least 8 characters long",
				},
			},
		})
		return
	}

	// Check for strong password (at least one uppercase, one lowercase, one number)
	hasUpper := false
	hasLower := false
	hasNumber := false
	for _, char := range req.Password {
		if char >= 'A' && char <= 'Z' {
			hasUpper = true
		} else if char >= 'a' && char <= 'z' {
			hasLower = true
		} else if char >= '0' && char <= '9' {
			hasNumber = true
		}
	}
	if !hasUpper || !hasLower || !hasNumber {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
			"errors": []gin.H{
				{
					"field":   "password",
					"message": "Password must contain at least one uppercase letter, one lowercase letter, and one number",
				},
			},
		})
		return
	}

	// Check if email already exists
	var existingEmail models.User
	if err := database.DB.Where("email = ?", req.Email).First(&existingEmail).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"success": false,
			"message": "Email already exists",
			"errors": []gin.H{
				{
					"field":   "email",
					"message": "This email address is already registered",
				},
			},
		})
		return
	}

	// Check if username already exists
	var existingUsername models.User
	if err := database.DB.Where("username = ?", req.Username).First(&existingUsername).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{
			"success": false,
			"message": "Username already exists",
			"errors": []gin.H{
				{
					"field":   "username",
					"message": "This username is already taken",
				},
			},
		})
		return
	}

	// Validate phone number format if provided
	if req.Phone != "" {
		// Basic E.164 format validation
		if !strings.HasPrefix(req.Phone, "+") || len(req.Phone) < 8 || len(req.Phone) > 15 {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid phone number format",
				"errors": []gin.H{
					{
						"field":   "phone",
						"message": "Please enter a valid international phone number (e.g., +8613800138000)",
					},
				},
			})
			return
		}
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to process registration",
		})
		return
	}

	// Parse date of birth if provided
	var dateOfBirth *time.Time
	if req.DateOfBirth != "" {
		if parsed, err := time.Parse("2006-01-02", req.DateOfBirth); err == nil {
			// Check if date is not in the future
			if parsed.After(time.Now()) {
				c.JSON(http.StatusBadRequest, gin.H{
					"success": false,
					"message": "Date of birth cannot be in the future",
					"errors": []gin.H{
						{
							"field":   "dateOfBirth",
							"message": "Date of birth cannot be in the future",
						},
					},
				})
				return
			}
			dateOfBirth = &parsed
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid date format",
				"errors": []gin.H{
					{
						"field":   "dateOfBirth",
						"message": "Please enter a valid date (YYYY-MM-DD)",
					},
				},
			})
			return
		}
	}

	// Create user
	user := models.User{
		Username:    req.Username,
		Email:       req.Email,
		Password:    hashedPassword,
		FirstName:   req.FirstName,
		LastName:    req.LastName,
		Phone:       &req.Phone,
		DateOfBirth: dateOfBirth,
		Role:        "user",
		Status:      "active",
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create user",
		})
		return
	}

	// Generate email verification token
	token := utils.GenerateEmailVerificationToken()
	expiresAt := time.Now().Add(24 * time.Hour)

	verificationToken := models.EmailVerificationToken{
		UserID:    user.ID,
		Token:     token,
		ExpiresAt: expiresAt,
	}

	if err := database.DB.Create(&verificationToken).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create verification token",
		})
		return
	}

	// Send verification email
	go func() {
		utils.SendVerificationEmail(user.Email, user.Username, token)
	}()

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "User registered successfully. Please check your email for verification.",
		"data": gin.H{
			"userId":    user.ID,
			"username":  user.Username,
			"email":     user.Email,
			"status":    user.Status,
			"createdAt": user.CreatedAt,
		},
	})
}

// Login handles user login
func (h *AuthHandler) Login(c *gin.Context) {
	var req models.UserLogin
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
		})
		return
	}

	var user models.User
	query := database.DB

	if req.Username != "" {
		query = query.Where("username = ?", req.Username)
	} else if req.Email != "" {
		query = query.Where("email = ?", req.Email)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "用户名或邮箱必填",
		})
		return
	}

	if err := query.First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "用户名或邮箱不存在或密码错误",
		})
		return
	}

	if !utils.CheckPassword(req.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "用户名或邮箱不存在或密码错误",
		})
		return
	}

	now := time.Now()
	database.DB.Model(&user).Update("last_login_at", now)

	// Generate tokens
	tokenPair, err := utils.GenerateTokenPair(user.ID, user.Username, user.Email, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to generate tokens",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login successful",
		"data": gin.H{
			"user": gin.H{
				"id":          user.ID,
				"username":    user.Username,
				"email":       user.Email,
				"firstName":   user.FirstName,
				"lastName":    user.LastName,
				"role":        user.Role,
				"status":      user.Status,
				"lastLoginAt": now,
			},
			"token": tokenPair,
		},
	})
}

// RefreshToken handles token refresh
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req models.RefreshToken
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
		})
		return
	}

	// Validate refresh token
	claims, err := utils.ValidateToken(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid refresh token",
		})
		return
	}

	// Generate new token pair
	tokenPair, err := utils.GenerateTokenPair(claims.UserID, claims.Username, claims.Email, claims.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to generate tokens",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Token refreshed successfully",
		"data":    tokenPair,
	})
}

// Logout handles user logout
func (h *AuthHandler) Logout(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader != "" {
		tokenParts := []string{}
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			tokenParts = []string{"Bearer", authHeader[7:]}
		}

		if len(tokenParts) == 2 {
			// Blacklist the token
			claims, err := utils.ValidateToken(tokenParts[1])
			if err == nil {
				expiresAt := time.Unix(claims.ExpiresAt.Unix(), 0)
				blacklistedToken := models.TokenBlacklist{
					Token:     tokenParts[1],
					ExpiresAt: expiresAt,
				}
				database.DB.Create(&blacklistedToken)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logout successful",
	})
}

// VerifyEmail handles email verification
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	var req models.EmailVerification
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
		})
		return
	}

	// Find verification token
	var verificationToken models.EmailVerificationToken
	if err := database.DB.Where("token = ? AND used = ? AND expires_at > ?", req.Token, false, time.Now()).First(&verificationToken).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid or expired verification token",
		})
		return
	}

	// Update user
	if err := database.DB.Model(&models.User{}).Where("id = ?", verificationToken.UserID).Updates(map[string]interface{}{
		"email_verified":     true,
		"email_verified_at":  time.Now(),
		"status":            "active",
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to verify email",
		})
		return
	}

	// Mark token as used
	database.DB.Model(&verificationToken).Update("used", true)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Email verified successfully",
	})
}

// ForgotPassword handles password reset request
func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req models.ForgotPassword
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
		})
		return
	}

	// Find user by email
	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		// Don't reveal if user exists or not
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "If the email exists, a password reset link has been sent",
		})
		return
	}

	// Generate password reset token
	token := utils.GeneratePasswordResetToken()
	expiresAt := time.Now().Add(1 * time.Hour)

	resetToken := models.PasswordResetToken{
		UserID:    user.ID,
		Token:     token,
		ExpiresAt: expiresAt,
	}

	if err := database.DB.Create(&resetToken).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create reset token",
		})
		return
	}

	// Send password reset email
	go func() {
		utils.SendPasswordResetEmail(user.Email, user.Username, token)
	}()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "If the email exists, a password reset link has been sent",
	})
}

// ResetPassword handles password reset
func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req models.ResetPassword
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
		})
		return
	}

	// Check if passwords match
	if req.NewPassword != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Passwords do not match",
		})
		return
	}

	// Find reset token
	var resetToken models.PasswordResetToken
	if err := database.DB.Where("token = ? AND used = ? AND expires_at > ?", req.Token, false, time.Now()).First(&resetToken).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid or expired reset token",
		})
		return
	}

	// Hash new password
	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to process password reset",
		})
		return
	}

	// Update user password
	if err := database.DB.Model(&models.User{}).Where("id = ?", resetToken.UserID).Updates(map[string]interface{}{
		"password":           hashedPassword,
		"password_changed_at": time.Now(),
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to reset password",
		})
		return
	}

	// Mark token as used
	database.DB.Model(&resetToken).Update("used", true)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password reset successfully",
	})
} 