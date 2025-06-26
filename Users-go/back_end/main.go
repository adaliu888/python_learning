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
	"newworld-project/config"
	"newworld-project/database"
	"newworld-project/routes"
)

func main() {
	// Load configuration
	config.LoadConfig()

	// Connect to database
	database.ConnectDB()

	// Setup routes
	r := routes.SetupRoutes()

	// Create server
	serverAddr := fmt.Sprintf("%s:%s", config.ConfigInstance.Server.Host, config.ConfigInstance.Server.Port)
	server := &http.Server{
		Addr:    serverAddr,
		Handler: r,
	}

	// Start server in a goroutine
	go func() {
		log.Printf("Server starting on %s", serverAddr)
		log.Printf("API Documentation available at: http://%s/api/v1", serverAddr)
		log.Printf("Health check available at: http://%s/health", serverAddr)
		
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start server:", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// The context is used to inform the server it has 5 seconds to finish
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
} 