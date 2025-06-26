@echo off
echo ========================================
echo NewWorld Backend - Diagnosis and Fix
echo ========================================
echo.

REM Check administrator privileges
echo [1] Checking privileges...
net session >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Running with administrator privileges
) else (
    echo ⚠️  Running with standard privileges
    echo    Note: Some ports may require admin privileges
)
echo.

REM Check Go installation
echo [2] Checking Go installation...
go version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Go is not installed or not in PATH
    echo    Please install Go from https://golang.org/dl/
    pause
    exit /b 1
)
echo ✅ Go is installed correctly
echo.

REM Check dependencies
echo [3] Checking dependencies...
go mod tidy >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Failed to download dependencies
    echo    Trying to fix...
    go clean -modcache >nul 2>&1
    go mod download >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Failed to fix dependencies
        pause
        exit /b 1
    )
)
echo ✅ Dependencies are up to date
echo.

REM Check port availability
echo [4] Checking port availability...
set START_PORT=8081
set END_PORT=8090
set AVAILABLE_PORT=0

for /l %%i in (%START_PORT%,1,%END_PORT%) do (
    netstat -an | findstr :%%i >nul 2>&1
    if !errorlevel! neq 0 (
        if !AVAILABLE_PORT! equ 0 (
            set AVAILABLE_PORT=%%i
            echo ✅ Found available port: %%i
        )
    )
)

if %AVAILABLE_PORT% equ 0 (
    echo ❌ No available ports found between %START_PORT% and %END_PORT%
    echo    Please free up some ports or modify the range
    pause
    exit /b 1
)
echo.

REM Check firewall
echo [5] Checking firewall status...
netsh advfirewall show allprofiles state | findstr "ON" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Windows Firewall is enabled
    echo    You may need to add an exception for port %AVAILABLE_PORT%
    echo    To add exception: netsh advfirewall firewall add rule name="NewWorld Backend" dir=in action=allow protocol=TCP localport=%AVAILABLE_PORT%
) else (
    echo ✅ Windows Firewall is disabled
)
echo.

REM Check antivirus interference
echo [6] Checking for potential antivirus interference...
tasklist | findstr /i "avast\|avg\|norton\|mcafee\|kaspersky\|bitdefender" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Antivirus software detected
    echo    You may need to add an exception for the application
) else (
    echo ✅ No major antivirus software detected
)
echo.

REM Set environment variables
echo [7] Setting up environment...
set SERVER_PORT=%AVAILABLE_PORT%
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

echo Environment configured:
echo   Port: %SERVER_PORT%
echo   Database: %DB_TYPE% (%DB_NAME%)
echo   Host: %SERVER_HOST%
echo.

REM Test database connection
echo [8] Testing database connection...
if exist %DB_NAME% (
    echo ✅ Database file exists
) else (
    echo ℹ️  Database file will be created on first run
)
echo.

REM Final summary
echo ========================================
echo Diagnosis Complete
echo ========================================
echo.
echo ✅ All checks passed
echo ✅ Ready to start server
echo.
echo Server will start on:
echo   URL: http://localhost:%AVAILABLE_PORT%
echo   API Docs: http://localhost:%AVAILABLE_PORT%/api/v1
echo   Health: http://localhost:%AVAILABLE_PORT%/health
echo.
echo Press any key to start the server...
pause >nul

echo.
echo Starting server...
echo Press Ctrl+C to stop
echo.

go run main.go

echo.
echo Server stopped.
pause 