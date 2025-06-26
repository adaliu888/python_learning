@echo off
echo ========================================
echo NewWorld Backend Enhanced Startup
echo ========================================
echo.

REM Check if running as administrator (optional)
net session >nul 2>&1
if %errorlevel% equ 0 (
    echo Running with administrator privileges
) else (
    echo Running with standard privileges
)
echo.

REM Check Go installation
echo [1] Checking Go installation...
go version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Go is not installed or not in PATH
    echo Please install Go from https://golang.org/dl/
    pause
    exit /b 1
)
echo ✅ Go is installed correctly
echo.

REM Check dependencies
echo [2] Checking dependencies...
go mod tidy >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to download dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies are up to date
echo.

REM Find available port
echo [3] Checking port availability...
set PORT=8081
set MAX_PORT=8090

:port_check_loop
netstat -an | findstr :%PORT% >nul 2>&1
if %errorlevel% equ 0 (
    echo Port %PORT% is in use, trying next port...
    set /a PORT+=1
    if %PORT% gtr %MAX_PORT% (
        echo ERROR: No available ports found between 8081 and %MAX_PORT%
        pause
        exit /b 1
    )
    goto port_check_loop
) else (
    echo ✅ Port %PORT% is available
)
echo.

REM Set environment variables
echo [4] Setting environment variables...
set SERVER_PORT=%PORT%
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
echo   SERVER_PORT=%SERVER_PORT%
echo   DB_TYPE=%DB_TYPE%
echo   DB_NAME=%DB_NAME%
echo.

REM Check if database file exists
echo [5] Checking database...
if exist %DB_NAME% (
    echo ✅ Database file exists
) else (
    echo ℹ️  Database file will be created automatically
)
echo.

REM Start server
echo [6] Starting server...
echo ========================================
echo Server will start on port %PORT%
echo API Documentation: http://localhost:%PORT%/api/v1
echo Health Check: http://localhost:%PORT%/health
echo Root: http://localhost:%PORT%/
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

go run main.go

echo.
echo Server stopped.
pause 