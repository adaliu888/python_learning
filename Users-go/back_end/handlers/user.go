package handlers

import (
	"net/http"
	"time"

	"newworld-project/database"
	"newworld-project/models"
	"newworld-project/utils"

	"github.com/gin-gonic/gin"
)

type UserHandler struct{}

func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

// GetProfile gets the current user's profile
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, _ := c.Get("userID")

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"id":            user.ID,
			"username":      user.Username,
			"email":         user.Email,
			"firstName":     user.FirstName,
			"lastName":      user.LastName,
			"phone":         user.Phone,
			"dateOfBirth":   user.DateOfBirth,
			"bio":           user.Bio,
			"role":          user.Role,
			"status":        user.Status,
			"emailVerified": user.EmailVerified,
			"lastLoginAt":   user.LastLoginAt,
			"createdAt":     user.CreatedAt,
			"updatedAt":     user.UpdatedAt,
		},
	})
}

// UpdateProfile updates the current user's profile
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, _ := c.Get("userID")

	var req models.UserProfile
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Validation failed",
			"errors":  getValidationErrors(err),
		})
		return
	}

	// Parse date of birth if provided
	var dateOfBirth *time.Time
	if req.DateOfBirth != "" {
		if parsed, err := time.Parse("2006-01-02", req.DateOfBirth); err == nil {
			dateOfBirth = &parsed
		}
	}

	// Update user profile
	updates := map[string]interface{}{
		"first_name":   req.FirstName,
		"last_name":    req.LastName,
		"phone":        &req.Phone,
		"date_of_birth": dateOfBirth,
		"bio":          &req.Bio,
	}

	if err := database.DB.Model(&models.User{}).Where("id = ?", userID).Updates(updates).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to update profile",
		})
		return
	}

	// Get updated user
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Profile updated successfully",
		"data": gin.H{
			"id":            user.ID,
			"username":      user.Username,
			"email":         user.Email,
			"firstName":     user.FirstName,
			"lastName":      user.LastName,
			"phone":         user.Phone,
			"dateOfBirth":   user.DateOfBirth,
			"bio":           user.Bio,
			"role":          user.Role,
			"status":        user.Status,
			"emailVerified": user.EmailVerified,
			"lastLoginAt":   user.LastLoginAt,
			"createdAt":     user.CreatedAt,
			"updatedAt":     user.UpdatedAt,
		},
	})
}

// ChangePassword changes the current user's password
func (h *UserHandler) ChangePassword(c *gin.Context) {
	userID, _ := c.Get("userID")

	var req models.ChangePassword
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Validation failed",
			"errors":  getValidationErrors(err),
		})
		return
	}

	// Check if passwords match
	if req.NewPassword != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "New passwords do not match",
		})
		return
	}

	// Get current user
	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User not found",
		})
		return
	}

	// Verify current password
	if !utils.CheckPassword(req.CurrentPassword, user.Password) {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Current password is incorrect",
		})
		return
	}

	// Hash new password
	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to process password change",
		})
		return
	}

	// Update password
	if err := database.DB.Model(&user).Updates(map[string]interface{}{
		"password":            hashedPassword,
		"password_changed_at": time.Now(),
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to update password",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password changed successfully",
	})
} 