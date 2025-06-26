#!/bin/bash

echo "Starting NewWorld Backend Server..."

# Check if port 8081 is in use
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 8081 is already in use. Using port 8082 instead."
    export SERVER_PORT=8082
    export APP_URL=http://localhost:8082
else
    export SERVER_PORT=8081
    export APP_URL=http://localhost:8081
fi

# Set environment variables
export SERVER_HOST=localhost
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=teest1234
export DB_NAME=newworld_db
export DB_SSLMODE=disable
export JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure_change_in_production
export JWT_ACCESS_TOKEN_EXPIRY=3600
export JWT_REFRESH_TOKEN_EXPIRY=604800
export SMTP_HOST=smtp.gmail.com
export SMTP_PORT=587
export SMTP_USERNAME=your_email@gmail.com
export SMTP_PASSWORD=your_app_password
export EMAIL_FROM=your_email@gmail.com
export APP_NAME="NewWorld Project"
export FRONTEND_URL=http://localhost:3000
export BCRYPT_COST=12
export RATE_LIMIT_REQUESTS=100
export RATE_LIMIT_WINDOW=900

echo "Environment variables set:"
echo "SERVER_PORT=$SERVER_PORT"
echo "DB_HOST=$DB_HOST"
echo "DB_PORT=$DB_PORT"
echo "DB_USER=$DB_USER"
echo "DB_NAME=$DB_NAME"

echo ""
echo "Starting server on port $SERVER_PORT..."
echo "API Documentation will be available at: $APP_URL/api/v1"
echo ""

go run main.go 