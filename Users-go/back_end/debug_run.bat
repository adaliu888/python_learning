@echo off
echo ========================================
echo NewWorld Backend - Debug Run
echo ========================================
echo.

echo [1] Setting environment variables...
set SERVER_PORT=8081
set SERVER_HOST=localhost
set DB_TYPE=sqlite
set DB_NAME=newworld.db
set JWT_SECRET=debug_secret_key
set JWT_ACCESS_TOKEN_EXPIRY=3600
set JWT_REFRESH_TOKEN_EXPIRY=604800
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_USERNAME=test@example.com
set SMTP_PASSWORD=test
set EMAIL_FROM=test@example.com
set APP_NAME=NewWorld Project
set FRONTEND_URL=http://localhost:3000
set BCRYPT_COST=12
set RATE_LIMIT_REQUESTS=100
set RATE_LIMIT_WINDOW=900

echo Environment variables set:
echo   SERVER_PORT=%SERVER_PORT%
echo   DB_TYPE=%DB_TYPE%
echo   DB_NAME=%DB_NAME%
echo.

echo [2] Checking port availability...
netstat -an | findstr :%SERVER_PORT%
if %errorlevel% equ 0 (
    echo ❌ Port %SERVER_PORT% is in use
    echo    Trying port 8082...
    set SERVER_PORT=8082
    netstat -an | findstr :%SERVER_PORT%
    if %errorlevel% equ 0 (
        echo ❌ Port 8082 is also in use
        echo    Please free up some ports
        pause
        exit /b 1
    ) else (
        echo ✅ Port %SERVER_PORT% is available
    )
) else (
    echo ✅ Port %SERVER_PORT% is available
)
echo.

echo [3] Checking Go installation...
go version
if %errorlevel% neq 0 (
    echo ❌ Go is not installed
    pause
    exit /b 1
)
echo ✅ Go is installed
echo.

echo [4] Running the application...
echo Starting server on port %SERVER_PORT%...
echo Press Ctrl+C to stop
echo.

go run main.go

echo.
echo Server stopped.
pause 