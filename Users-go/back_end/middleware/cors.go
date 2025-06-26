package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "https://newworld.com"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"}
	config.AllowHeaders = []string{
		"Origin", 
		"Content-Type", 
		"Accept", 
		"Authorization", 
		"X-Requested-With",
		"Access-Control-Request-Method",
		"Access-Control-Request-Headers",
	}
	config.AllowCredentials = true
	config.ExposeHeaders = []string{"Content-Length", "Content-Type"}

	return cors.New(config)
} 