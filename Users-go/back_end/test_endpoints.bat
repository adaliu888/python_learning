@echo off
echo ========================================
echo NewWorld API Endpoints Test
echo ========================================
echo.

set BASE_URL=http://localhost:8081

echo [1] Testing root endpoint...
curl -s %BASE_URL%/ | findstr "success"
if %errorlevel% equ 0 (
    echo ✅ Root endpoint working
) else (
    echo ❌ Root endpoint failed
)
echo.

echo [2] Testing health check...
curl -s %BASE_URL%/health | findstr "success"
if %errorlevel% equ 0 (
    echo ✅ Health check working
) else (
    echo ❌ Health check failed
)
echo.

echo [3] Testing API documentation...
curl -s %BASE_URL%/api/v1 | findstr "success"
if %errorlevel% equ 0 (
    echo ✅ API docs working
) else (
    echo ❌ API docs failed
)
echo.

echo [4] Testing user registration...
curl -s -X POST %BASE_URL%/api/v1/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"Password123!\",\"confirmPassword\":\"Password123!\",\"firstName\":\"Test\",\"lastName\":\"User\",\"acceptTerms\":true}" | findstr "success"
if %errorlevel% equ 0 (
    echo ✅ User registration working
) else (
    echo ❌ User registration failed
)
echo.

echo [5] Testing user login...
curl -s -X POST %BASE_URL%/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"Password123!\"}" | findstr "success"
if %errorlevel% equ 0 (
    echo ✅ User login working
) else (
    echo ❌ User login failed
)
echo.

echo ========================================
echo Test completed!
echo ========================================
echo.
echo You can now:
echo 1. Visit: %BASE_URL%/ (Root)
echo 2. Visit: %BASE_URL%/health (Health check)
echo 3. Visit: %BASE_URL%/api/v1 (API docs)
echo 4. Test registration: %BASE_URL%/api/v1/auth/register
echo 5. Test login: %BASE_URL%/api/v1/auth/login
echo.
pause 