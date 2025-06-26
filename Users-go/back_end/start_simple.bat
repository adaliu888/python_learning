@echo off
echo Starting NewWorld Backend Server (Simple Mode with SQLite)...

REM Check if port 8081 is in use
netstat -an | findstr :8081 >nul
if %errorlevel% equ 0 (
    echo Port 8081 is already in use. Using port 8082 instead.
    set SERVER_PORT=8082
    set APP_URL=http://localhost:8082
) else (
    set SERVER_PORT=8081
    set APP_URL=http://localhost:8081
)

REM Set environment variables for simple mode
set SERVER_HOST=localhost
set DB_TYPE=sqlite
set DB_NAME=newworld.db
set JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure_change_in_production
set JWT_ACCESS_TOKEN_EXPIRY=3600
set JWT_REFRESH_TOKEN_EXPIRY=604800
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_USERNAME=your_email@gmail.com
set SMTP_PASSWORD=your_app_password
set EMAIL_FROM=your_email@gmail.com
set APP_NAME=NewWorld Project
set FRONTEND_URL=http://localhost:3000
set BCRYPT_COST=12
set RATE_LIMIT_REQUESTS=100
set RATE_LIMIT_WINDOW=900

echo Environment variables set:
echo SERVER_PORT=%SERVER_PORT%
echo DB_TYPE=%DB_TYPE%
echo DB_NAME=%DB_NAME%

echo.
echo Starting server on port %SERVER_PORT%...
echo API Documentation will be available at: %APP_URL%/api/v1
echo.

go run main.go 