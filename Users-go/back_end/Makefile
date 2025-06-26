.PHONY: help build run test clean docker-build docker-run

# 默认目标
help:
	@echo "NewWorld Project Backend - 可用命令:"
	@echo "  build        - 构建应用程序"
	@echo "  run          - 运行应用程序"
	@echo "  test         - 运行测试"
	@echo "  clean        - 清理构建文件"
	@echo "  docker-build - 构建Docker镜像"
	@echo "  docker-run   - 使用Docker Compose运行"
	@echo "  deps         - 安装依赖"
	@echo "  fmt          - 格式化代码"
	@echo "  lint         - 代码检查"

# 安装依赖
deps:
	@echo "安装依赖..."
	go mod tidy
	go mod download

# 格式化代码
fmt:
	@echo "格式化代码..."
	go fmt ./...

# 代码检查
lint:
	@echo "代码检查..."
	golangci-lint run

# 构建应用程序
build:
	@echo "构建应用程序..."
	go build -o bin/newworld-backend main.go

# 运行应用程序
run:
	@echo "运行应用程序..."
	go run main.go

# 运行测试
test:
	@echo "运行测试..."
	go test ./...

# 清理构建文件
clean:
	@echo "清理构建文件..."
	rm -rf bin/
	go clean

# 构建Docker镜像
docker-build:
	@echo "构建Docker镜像..."
	docker build -t newworld-backend .

# 使用Docker Compose运行
docker-run:
	@echo "使用Docker Compose运行..."
	docker-compose up --build

# 停止Docker Compose
docker-stop:
	@echo "停止Docker Compose..."
	docker-compose down

# 开发模式运行（带热重载）
dev:
	@echo "开发模式运行..."
	@if command -v air > /dev/null; then \
		air; \
	else \
		echo "Air未安装，使用go run..."; \
		go run main.go; \
	fi

# 安装Air（热重载工具）
install-air:
	@echo "安装Air..."
	go install github.com/cosmtrek/air@latest

# 生成API文档
docs:
	@echo "生成API文档..."
	@if command -v swag > /dev/null; then \
		swag init; \
	else \
		echo "Swag未安装，跳过API文档生成"; \
	fi

# 安装Swag（API文档生成工具）
install-swag:
	@echo "安装Swag..."
	go install github.com/swaggo/swag/cmd/swag@latest 