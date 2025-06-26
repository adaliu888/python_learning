package database

import (
	"fmt"
	"log"
	"newworld-project/config"
	"newworld-project/models"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	dbType := os.Getenv("DB_TYPE")
	
	var err error
	
	if dbType == "sqlite" {
		// Use SQLite for development/testing
		dbName := os.Getenv("DB_NAME")
		if dbName == "" {
			dbName = "newworld.db"
		}
		
		DB, err = gorm.Open(sqlite.Open(dbName), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
		
		if err != nil {
			log.Fatal("Failed to connect to SQLite database:", err)
		}
		
		log.Println("SQLite database connected successfully")
	} else {
		// Use PostgreSQL
		cfg := config.ConfigInstance.Database
		
		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Shanghai",
			cfg.Host,
			cfg.User,
			cfg.Password,
			cfg.Name,
			cfg.Port,
			cfg.SSLMode,
		)

		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})

		if err != nil {
			log.Fatal("Failed to connect to PostgreSQL database:", err)
		}
		
		log.Println("PostgreSQL database connected successfully")
	}

	// Auto migrate the schema
	err = DB.AutoMigrate(
		&models.User{},
		&models.TokenBlacklist{},
		&models.EmailVerificationToken{},
		&models.PasswordResetToken{},
	)

	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database migrated successfully")
}

func GetDB() *gorm.DB {
	return DB
} 