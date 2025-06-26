# NewWorld Project Backend

基于Gin框架和PostgreSQL数据库的RESTful API后端服务，实现了完整的用户认证和授权系统。

## 功能特性

### 🔐 认证与授权
- **用户注册** - 支持邮箱验证
- **用户登录** - JWT令牌认证
- **令牌刷新** - 自动刷新访问令牌
- **用户登出** - 令牌黑名单机制
- **邮箱验证** - 注册后邮箱验证
- **密码重置** - 安全的密码重置流程

### 👤 用户管理
- **个人资料** - 查看和更新用户信息
- **密码修改** - 安全的密码更改
- **角色管理** - 基于角色的访问控制

### 🛡️ 安全特性
- **JWT认证** - 安全的令牌认证
- **密码加密** - bcrypt密码哈希
- **CORS支持** - 跨域请求处理
- **输入验证** - 完整的请求数据验证
- **令牌黑名单** - 登出时令牌失效

## 技术栈

- **框架**: Gin (Go Web Framework)
- **数据库**: PostgreSQL
- **ORM**: GORM
- **认证**: JWT (JSON Web Tokens)
- **密码加密**: bcrypt
- **邮件发送**: gomail
- **配置管理**: godotenv

## 项目结构

```
back_end/
├── config/          # 配置管理
│   └── config.go
├── database/        # 数据库连接
│   └── database.go
├── handlers/        # 请求处理器
│   ├── auth.go      # 认证处理器
│   ├── user.go      # 用户处理器
│   └── common.go    # 通用函数
├── middleware/      # 中间件
│   ├── auth.go      # JWT认证中间件
│   └── cors.go      # CORS中间件
├── models/          # 数据模型
│   └── user.go
├── routes/          # 路由配置
│   └── routes.go
├── utils/           # 工具函数
│   ├── jwt.go       # JWT工具
│   ├── password.go  # 密码工具
│   ├── random.go    # 随机字符串
│   └── email.go     # 邮件工具
├── main.go          # 主程序入口
├── go.mod           # Go模块文件
├── env.example      # 环境变量示例
├── start_server.bat # Windows启动脚本
├── start_server.sh  # Linux/Mac启动脚本
├── troubleshoot.bat # 问题诊断脚本
├── init_db.sql      # 数据库初始化脚本
└── README.md        # 项目说明
```

## 快速开始

### 1. 环境要求

- Go 1.21+
- PostgreSQL 12+
- SMTP服务器 (用于发送邮件)

### 2. 安装依赖

```bash
go mod tidy
```

### 3. 配置环境变量

复制环境变量示例文件并配置：

```bash
cp env.example .env
```

编辑 `.env` 文件，配置以下参数：

```env
# 服务器配置
SERVER_PORT=8081
SERVER_HOST=localhost

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=newworld_db
DB_SSLMODE=disable

# JWT配置
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
JWT_ACCESS_TOKEN_EXPIRY=3600
JWT_REFRESH_TOKEN_EXPIRY=604800

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# 应用配置
APP_NAME=NewWorld Project
APP_URL=http://localhost:8081
FRONTEND_URL=http://localhost:3000

# 安全配置
BCRYPT_COST=12
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900
```

### 4. 创建数据库

```sql
CREATE DATABASE newworld_db;
```

### 5. 运行服务

#### 方法一：使用启动脚本（推荐）

**Windows:**
```bash
start_server.bat
```

**Linux/Mac:**
```bash
chmod +x start_server.sh
./start_server.sh
```

#### 方法二：直接运行

```bash
go run main.go
```

服务将在 `http://localhost:8081` 启动。

## 问题诊断与解决

### 常见问题

#### 1. 端口被占用错误
```
listen tcp 127.0.0.1:8081: bind: An attempt was made to access a socket in a way forbidden by its access permissions.
```

**解决方案：**
- 使用启动脚本，会自动检测端口并切换到可用端口
- 手动修改 `.env` 文件中的 `SERVER_PORT=8082`
- 检查是否有其他服务占用8081端口

#### 2. 数据库连接失败
```
Failed to connect to database: dial tcp 127.0.0.1:5432: connect: connection refused
```

**解决方案：**
- 确保PostgreSQL服务正在运行
- 检查数据库连接参数是否正确
- 使用Docker启动PostgreSQL：
  ```bash
  docker run --name postgres-newworld -e POSTGRES_PASSWORD=teest1234 -p 5432:5432 -d postgres:13
  ```

#### 3. 依赖包下载失败
```
go: module lookup disabled by GOPROXY=off
```

**解决方案：**
```bash
go env -w GOPROXY=https://goproxy.cn,direct
go mod tidy
```

### 使用诊断脚本

运行诊断脚本来自动检测和解决常见问题：

**Windows:**
```bash
troubleshoot.bat
```

诊断脚本会检查：
- Go安装状态
- 依赖包完整性
- 端口可用性
- 数据库连接
- 数据库存在性

### 手动数据库初始化

如果自动迁移失败，可以手动执行SQL脚本：

```bash
psql -h localhost -U postgres -d newworld_db -f init_db.sql
```

## API 端点

### 认证端点

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | `/api/v1/auth/register` | 用户注册 | ❌ |
| POST | `/api/v1/auth/login` | 用户登录 | ❌ |
| POST | `/api/v1/auth/refresh` | 刷新令牌 | ✅ |
| POST | `/api/v1/auth/logout` | 用户登出 | ✅ |
| POST | `/api/v1/auth/verify-email` | 邮箱验证 | ❌ |
| POST | `/api/v1/auth/forgot-password` | 忘记密码 | ❌ |
| POST | `/api/v1/auth/reset-password` | 重置密码 | ❌ |

### 用户端点

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/v1/users/profile` | 获取用户资料 | ✅ |
| PUT | `/api/v1/users/profile` | 更新用户资料 | ✅ |
| POST | `/api/v1/users/change-password` | 修改密码 | ✅ |

## 使用示例

### 用户注册

```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123!",
    "confirmPassword": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "acceptTerms": true
  }'
```

### 用户登录

```bash
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

### 获取用户资料

```bash
curl -X GET http://localhost:8081/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 数据库模型

### 用户表 (users)
- `id` - 主键
- `username` - 用户名 (唯一)
- `email` - 邮箱 (唯一)
- `password` - 密码哈希
- `first_name` - 名
- `last_name` - 姓
- `phone` - 电话
- `date_of_birth` - 出生日期
- `bio` - 个人简介
- `role` - 角色 (user/admin/moderator)
- `status` - 状态 (pending_verification/active/inactive/suspended)
- `email_verified` - 邮箱是否验证
- `email_verified_at` - 邮箱验证时间
- `last_login_at` - 最后登录时间
- `password_changed_at` - 密码修改时间
- `created_at` - 创建时间
- `updated_at` - 更新时间

### 令牌黑名单表 (token_blacklists)
- `id` - 主键
- `token` - JWT令牌
- `expires_at` - 过期时间
- `created_at` - 创建时间

### 邮箱验证令牌表 (email_verification_tokens)
- `id` - 主键
- `user_id` - 用户ID
- `token` - 验证令牌
- `expires_at` - 过期时间
- `used` - 是否已使用
- `created_at` - 创建时间

### 密码重置令牌表 (password_reset_tokens)
- `id` - 主键
- `user_id` - 用户ID
- `token` - 重置令牌
- `expires_at` - 过期时间
- `used` - 是否已使用
- `created_at` - 创建时间

## 开发指南

### 添加新的API端点

1. 在 `models/` 中定义数据模型
2. 在 `handlers/` 中创建处理器
3. 在 `routes/routes.go` 中添加路由
4. 更新API文档

### 自定义验证器

在 `handlers/common.go` 的 `init()` 函数中注册自定义验证器。

### 添加新的中间件

在 `middleware/` 目录中创建新的中间件文件。

## 部署

### Docker部署

```dockerfile
FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

EXPOSE 8081

CMD ["./main"]
```

### 生产环境配置

1. 设置强密码的JWT密钥
2. 配置HTTPS
3. 设置适当的CORS策略
4. 配置数据库连接池
5. 设置日志记录
6. 配置监控和告警

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查数据库配置
   - 确保PostgreSQL服务正在运行

2. **邮件发送失败**
   - 检查SMTP配置
   - 确保邮箱应用密码正确

3. **JWT令牌无效**
   - 检查JWT密钥配置
   - 确保令牌未过期

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License 