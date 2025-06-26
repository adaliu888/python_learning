package main

import (
	"fmt"
	"net"
	"os"
	"newworld-project/config"
)

func main() {
	// Set environment variables for testing
	os.Setenv("SERVER_PORT", "8081")
	os.Setenv("DB_TYPE", "sqlite")
	os.Setenv("DB_NAME", "newworld.db")
	
	fmt.Println("=== Configuration Test ===")
	fmt.Printf("Environment variables:\n")
	fmt.Printf("  SERVER_PORT: %s\n", os.Getenv("SERVER_PORT"))
	fmt.Printf("  DB_TYPE: %s\n", os.Getenv("DB_TYPE"))
	fmt.Printf("  DB_NAME: %s\n", os.Getenv("DB_NAME"))
	fmt.Println()
	
	// Load configuration
	config.LoadConfig()
	
	fmt.Printf("Loaded configuration:\n")
	fmt.Printf("  Server Host: %s\n", config.ConfigInstance.Server.Host)
	fmt.Printf("  Server Port: %s\n", config.ConfigInstance.Server.Port)
	fmt.Printf("  Database Type: %s\n", os.Getenv("DB_TYPE"))
	fmt.Printf("  Database Name: %s\n", os.Getenv("DB_NAME"))
	fmt.Println()
	
	// Test port availability
	fmt.Println("=== Port Availability Test ===")
	port := 8081
	fmt.Printf("Testing port %d...\n", port)
	
	// Simple port test
	address := fmt.Sprintf(":%d", port)
	listener, err := net.Listen("tcp", address)
	if err != nil {
		fmt.Printf("❌ Port %d is not available: %v\n", port, err)
	} else {
		listener.Close()
		fmt.Printf("✅ Port %d is available\n", port)
	}
	
	fmt.Println("=== Test Complete ===")
} 