#!/bin/bash

# API测试脚本
BASE_URL="http://localhost:8080/api/v1"

echo "🚀 NewWorld Project API 测试脚本"
echo "=================================="

# 测试服务器是否运行
echo "1. 测试服务器连接..."
if curl -s "$BASE_URL" > /dev/null; then
    echo "✅ 服务器连接成功"
else
    echo "❌ 服务器连接失败，请确保服务器正在运行"
    exit 1
fi

echo ""
echo "2. 测试用户注册..."

# 注册用户
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123!",
    "confirmPassword": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+1234567890",
    "acceptTerms": true
  }')

echo "注册响应: $REGISTER_RESPONSE"

# 检查注册是否成功
if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
    echo "✅ 用户注册成功"
else
    echo "❌ 用户注册失败"
    echo "响应: $REGISTER_RESPONSE"
fi

echo ""
echo "3. 测试用户登录..."

# 登录用户
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }')

echo "登录响应: $LOGIN_RESPONSE"

# 提取访问令牌
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ]; then
    echo "✅ 用户登录成功，获取到访问令牌"
    
    echo ""
    echo "4. 测试获取用户资料..."
    
    # 获取用户资料
    PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/users/profile" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    
    echo "用户资料响应: $PROFILE_RESPONSE"
    
    if echo "$PROFILE_RESPONSE" | grep -q '"success":true'; then
        echo "✅ 获取用户资料成功"
    else
        echo "❌ 获取用户资料失败"
    fi
    
    echo ""
    echo "5. 测试用户登出..."
    
    # 用户登出
    LOGOUT_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/logout" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    
    echo "登出响应: $LOGOUT_RESPONSE"
    
    if echo "$LOGOUT_RESPONSE" | grep -q '"success":true'; then
        echo "✅ 用户登出成功"
    else
        echo "❌ 用户登出失败"
    fi
    
else
    echo "❌ 用户登录失败，无法获取访问令牌"
    echo "响应: $LOGIN_RESPONSE"
fi

echo ""
echo "🎉 API测试完成！" 