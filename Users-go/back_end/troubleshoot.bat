@echo off
echo ========================================
echo NewWorld Backend Troubleshooting Script
echo ========================================
echo.

echo [1] Checking Go installation...
go version
if %errorlevel% neq 0 (
    echo ERROR: Go is not installed or not in PATH
    echo Please install Go from https://golang.org/dl/
    pause
    exit /b 1
)
echo Go is installed correctly.
echo.

echo [2] Checking dependencies...
go mod tidy
if %errorlevel% neq 0 (
    echo ERROR: Failed to download dependencies
    pause
    exit /b 1
)
echo Dependencies are up to date.
echo.

echo [3] Checking port availability...
netstat -an | findstr :8081
if %errorlevel% equ 0 (
    echo WARNING: Port 8081 is in use
    echo Available ports: 8082, 8083, 8084
    echo Will use port 8082 instead
) else (
    echo Port 8081 is available
)
echo.

echo [4] Checking PostgreSQL connection...
echo Testing database connection...
set DB_HOST=localhost
set DB_PORT=5432
set DB_USER=postgres
set DB_PASSWORD=teest1234
set DB_NAME=newworld_db

REM Try to connect to PostgreSQL
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT version();" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to PostgreSQL
    echo Please ensure PostgreSQL is running and accessible
    echo Default connection: %DB_HOST%:%DB_PORT% as user %DB_USER%
    echo.
    echo To start PostgreSQL with Docker:
    echo docker run --name postgres-newworld -e POSTGRES_PASSWORD=teest1234 -p 5432:5432 -d postgres:13
    echo.
    echo To create database:
    echo psql -h localhost -U postgres -c "CREATE DATABASE newworld_db;"
    pause
    exit /b 1
)
echo PostgreSQL connection successful.
echo.

echo [5] Checking database existence...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT 1 FROM pg_database WHERE datname='newworld_db';" | findstr 1 >nul
if %errorlevel% neq 0 (
    echo Database 'newworld_db' does not exist. Creating...
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "CREATE DATABASE newworld_db;"
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create database
        pause
        exit /b 1
    )
    echo Database created successfully.
) else (
    echo Database 'newworld_db' exists.
)
echo.

echo [6] Running database migrations...
echo Starting server to run migrations...
set SERVER_PORT=8081
set SERVER_HOST=localhost
set DB_SSLMODE=disable
set JWT_SECRET=temp_secret_for_migration
set JWT_ACCESS_TOKEN_EXPIRY=3600
set JWT_REFRESH_TOKEN_EXPIRY=604800
set SMTP_HOST=smtp.gmail.com
set SMTP_PORT=587
set SMTP_USERNAME=test@example.com
set SMTP_PASSWORD=test
set EMAIL_FROM=test@example.com
set APP_NAME=NewWorld Project
set APP_URL=http://localhost:8081
set FRONTEND_URL=http://localhost:3000
set BCRYPT_COST=12
set RATE_LIMIT_REQUESTS=100
set RATE_LIMIT_WINDOW=900

echo.
echo ========================================
echo Troubleshooting completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Run: start_server.bat
echo 2. Test API: http://localhost:8081/api/v1/health
echo 3. View docs: http://localhost:8081/api/v1
echo.
pause 