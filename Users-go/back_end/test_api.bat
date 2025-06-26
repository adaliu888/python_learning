@echo off
chcp 65001 >nul

echo 🚀 NewWorld Project API 测试脚本
echo ==================================

set BASE_URL=http://localhost:8080/api/v1

echo 1. 测试服务器连接...
curl -s "%BASE_URL%" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 服务器连接成功
) else (
    echo ❌ 服务器连接失败，请确保服务器正在运行
    pause
    exit /b 1
)

echo.
echo 2. 测试用户注册...

REM 注册用户
curl -s -X POST "%BASE_URL%/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"TestPassword123!\",\"confirmPassword\":\"TestPassword123!\",\"firstName\":\"Test\",\"lastName\":\"User\",\"phone\":\"+1234567890\",\"acceptTerms\":true}" > register_response.json

echo 注册响应已保存到 register_response.json

echo.
echo 3. 测试用户登录...

REM 登录用户
curl -s -X POST "%BASE_URL%/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"TestPassword123!\"}" > login_response.json

echo 登录响应已保存到 login_response.json

echo.
echo 4. 检查响应文件...
if exist register_response.json (
    echo ✅ 注册响应文件已创建
) else (
    echo ❌ 注册响应文件创建失败
)

if exist login_response.json (
    echo ✅ 登录响应文件已创建
) else (
    echo ❌ 登录响应文件创建失败
)

echo.
echo 🎉 API测试完成！
echo 请查看 register_response.json 和 login_response.json 文件以获取详细响应
pause 