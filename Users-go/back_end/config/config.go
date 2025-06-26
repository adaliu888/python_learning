package config

import (
	"fmt"
	"log"
	"net"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Email    EmailConfig
	App      AppConfig
	Security SecurityConfig
}

type ServerConfig struct {
	Port string
	Host string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

type JWTConfig struct {
	Secret              string
	AccessTokenExpiry   int
	RefreshTokenExpiry  int
}

type EmailConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
}

type AppConfig struct {
	Name        string
	URL         string
	FrontendURL string
}

type SecurityConfig struct {
	BcryptCost       int
	RateLimitRequests int
	RateLimitWindow   int
}

var ConfigInstance *Config

// Helper functions for port validation
func isPortAvailable(port int) bool {
	address := fmt.Sprintf(":%d", port)
	listener, err := net.Listen("tcp", address)
	if err != nil {
		return false
	}
	listener.Close()
	return true
}

func findAvailablePort(startPort int) (int, error) {
	for port := startPort; port < startPort+100; port++ {
		if isPortAvailable(port) {
			return port, nil
		}
	}
	return 0, fmt.Errorf("no available port found between %d and %d", startPort, startPort+100)
}

func getPortFromString(portStr string, defaultPort int) int {
	if portStr == "" {
		return defaultPort
	}
	
	port, err := strconv.Atoi(portStr)
	if err != nil || port <= 0 || port > 65535 {
		return defaultPort
	}
	
	return port
}

func LoadConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using environment variables")
	}

	// Get port with validation
	portStr := getEnv("SERVER_PORT", "8081")
	port := getPortFromString(portStr, 8081)
	
	// Check if port is available, if not find an available one
	if !isPortAvailable(port) {
		log.Printf("Warning: Port %d is not available", port)
		if availablePort, err := findAvailablePort(port); err == nil {
			port = availablePort
			log.Printf("Using available port: %d", port)
		} else {
			log.Printf("Error finding available port: %v", err)
		}
	}

	ConfigInstance = &Config{
		Server: ServerConfig{
			Port: strconv.Itoa(port),
			Host: getEnv("SERVER_HOST", "localhost"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "teest1234"),
			Name:     getEnv("DB_NAME", "newworld_db"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		JWT: JWTConfig{
			Secret:             getEnv("JWT_SECRET", "default_secret_key_change_in_production"),
			AccessTokenExpiry:  getEnvAsInt("JWT_ACCESS_TOKEN_EXPIRY", 3600),
			RefreshTokenExpiry: getEnvAsInt("JWT_REFRESH_TOKEN_EXPIRY", 604800),
		},
		Email: EmailConfig{
			Host:     getEnv("SMTP_HOST", "smtp.gmail.com"),
			Port:     getEnvAsInt("SMTP_PORT", 587),
			Username: getEnv("SMTP_USERNAME", ""),
			Password: getEnv("SMTP_PASSWORD", ""),
			From:     getEnv("EMAIL_FROM", ""),
		},
		App: AppConfig{
			Name:        getEnv("APP_NAME", "NewWorld Project"),
			URL:         getEnv("APP_URL", fmt.Sprintf("http://localhost:%d", port)),
			FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),
		},
		Security: SecurityConfig{
			BcryptCost:        getEnvAsInt("BCRYPT_COST", 12),
			RateLimitRequests: getEnvAsInt("RATE_LIMIT_REQUESTS", 100),
			RateLimitWindow:   getEnvAsInt("RATE_LIMIT_WINDOW", 900),
		},
	}

	log.Printf("Configuration loaded successfully")
	log.Printf("Server will run on: %s:%s", ConfigInstance.Server.Host, ConfigInstance.Server.Port)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
} 