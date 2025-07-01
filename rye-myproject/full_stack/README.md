# 用户认证系统

基于FastAPI和PostgreSQL的用户注册登录系统。

## 项目结构

```
full_stack/
├── src/
│   └── full_stack/
│       ├── __init__.py      # 包初始化文件
│       ├── auth.py          # 认证相关功能
│       ├── config.py        # 配置模块
│       ├── crud.py          # 数据库CRUD操作
│       ├── database.py      # 数据库连接
│       ├── main.py          # 主应用入口
│       ├── models.py        # 数据库模型
│       ├── run.py           # 运行脚本
│       └── schemas.py       # Pydantic模型
├── .venv/                   # 虚拟环境
├── api_docs.yaml            # API文档
├── pyproject.toml           # 项目配置
├── requirements.lock        # 依赖锁文件
└── requirements-dev.lock    # 开发依赖锁文件
```

## 功能特性

- 用户注册与登录
- JWT令牌认证
- 用户信息管理
- RESTful API接口
- PostgreSQL数据库存储

## 安装与设置

### 前提条件

- Python 3.10+
- PostgreSQL

### 安装步骤

1. 克隆仓库

```bash
git clone <repository-url>
cd full_stack
```

2. 安装依赖

```bash
rye sync
```

3. 配置数据库

创建PostgreSQL数据库：

```sql
CREATE DATABASE user_auth;
```

4. 配置环境变量

创建`.env`文件：

```
POSTGRES_SERVER=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=user_auth
SECRET_KEY=your_secret_key
```

## 运行应用

```bash
python -m full_stack.run
```

或者使用uvicorn直接运行：

```bash
uvicorn full_stack.main:app --reload
```

应用将在 http://localhost:8000 运行。

## API文档

启动应用后，可以访问以下URL查看API文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 使用示例

### 注册用户

```bash
curl -X 'POST' \
  'http://localhost:8000/users/' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}'
```

### 获取令牌

```bash
curl -X 'POST' \
  'http://localhost:8000/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=testuser&password=password123'
```

### 获取当前用户信息

```bash
curl -X 'GET' \
  'http://localhost:8000/users/me/' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```
