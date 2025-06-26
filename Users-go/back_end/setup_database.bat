@echo off
echo ========================================
echo NewWorld Database Setup Script
echo ========================================
echo.

echo [1] Checking PostgreSQL connection...
set DB_HOST=localhost
set DB_PORT=5432
set DB_USER=postgres
set DB_PASSWORD=teest1234

REM Test PostgreSQL connection
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT version();" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Cannot connect to PostgreSQL
    echo.
    echo Please ensure PostgreSQL is running. You can:
    echo 1. Start PostgreSQL service
    echo 2. Use Docker: docker run --name postgres-newworld -e POSTGRES_PASSWORD=teest1234 -p 5432:5432 -d postgres:13
    echo 3. Check if PostgreSQL is installed and running
    echo.
    pause
    exit /b 1
)
echo PostgreSQL connection successful.
echo.

echo [2] Creating database 'newworld_db'...
psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "CREATE DATABASE newworld_db;" >nul 2>&1
if %errorlevel% neq 0 (
    echo Database might already exist, checking...
    psql -h %DB_HOST% -p %DB_PORT% -U %DB_USER% -d postgres -c "SELECT 1 FROM pg_database WHERE datname='newworld_db';" | findstr 1 >nul
    if %errorlevel% equ 0 (
        echo Database 'newworld_db' already exists.
    ) else (
        echo ERROR: Failed to create database
        pause
        exit /b 1
    )
) else (
    echo Database 'newworld_db' created successfully.
)
echo.

echo [3] Running database migrations...
echo Starting server to run migrations...
set SERVER_PORT=8081
set SERVER_HOST=localhost
set DB_NAME=newworld_db
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

echo Running migrations...
timeout /t 5 /nobreak >nul
echo.
echo ========================================
echo Database setup completed!
echo ========================================
echo.
echo Next steps:
echo 1. Run: start_server.bat
echo 2. Test API: http://localhost:8081/api/v1/health
echo 3. View docs: http://localhost:8081/api/v1
echo.
pause 