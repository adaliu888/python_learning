package routes

import (
	"net/http"
	"newworld-project/handlers"
	"newworld-project/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// Set trusted proxies to avoid security warnings
	// In development, trust localhost only
	r.SetTrustedProxies([]string{"127.0.0.1", "::1"})

	// Add CORS middleware
	r.Use(middleware.CORSMiddleware())

	// Root endpoint
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "NewWorld Project API Server",
			"version": "1.0.0",
			"docs":    "/api/v1",
		})
	})

	// Health check endpoint
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Server is healthy",
			"status":  "running",
		})
	})

	// API v1 routes
	v1 := r.Group("/api/v1")
	{
		// API documentation endpoint
		v1.GET("", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"message": "NewWorld Project API v1",
				"endpoints": gin.H{
					"auth": gin.H{
						"register":        "POST /api/v1/auth/register",
						"login":           "POST /api/v1/auth/login",
						"verify-email":    "POST /api/v1/auth/verify-email",
						"forgot-password": "POST /api/v1/auth/forgot-password",
						"reset-password":  "POST /api/v1/auth/reset-password",
						"refresh":         "POST /api/v1/auth/refresh",
						"logout":          "POST /api/v1/auth/logout",
					},
					"users": gin.H{
						"profile":         "GET /api/v1/users/profile",
						"update-profile":  "PUT /api/v1/users/profile",
						"change-password": "POST /api/v1/users/change-password",
					},
				},
				"swagger": "/docs",
			})
		})

		// Auth routes (no authentication required)
		auth := v1.Group("/auth")
		{
			authHandler := handlers.NewAuthHandler()
			
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/verify-email", authHandler.VerifyEmail)
			auth.POST("/forgot-password", authHandler.ForgotPassword)
			auth.POST("/reset-password", authHandler.ResetPassword)
		}

		// Protected routes (authentication required)
		protected := v1.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// Auth routes that require authentication
			authHandler := handlers.NewAuthHandler()
			protected.POST("/auth/refresh", authHandler.RefreshToken)
			protected.POST("/auth/logout", authHandler.Logout)

			// User routes
			userHandler := handlers.NewUserHandler()
			users := protected.Group("/users")
			{
				users.GET("/profile", userHandler.GetProfile)
				users.PUT("/profile", userHandler.UpdateProfile)
				users.POST("/change-password", userHandler.ChangePassword)
			}
		}
	}

	return r
} 