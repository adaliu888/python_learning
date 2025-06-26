# NewWorld Project - 用户认证系统

一个完整的用户认证系统，包含后端API服务和前端React应用。

## 🏗️ 项目架构

```
newworld-project/
├── back_end/           # Golang + Gin 后端服务
│   ├── config/        # 配置文件
│   ├── handlers/      # 请求处理器
│   ├── middleware/    # 中间件
│   ├── models/        # 数据模型
│   ├── routes/        # 路由定义
│   ├── utils/         # 工具函数
│   └── main.go        # 主程序入口
├── front_end/         # React 前端应用
│   ├── src/          # 源代码
│   ├── public/       # 静态资源
│   └── package.json  # 依赖配置
├── docs/             # API文档
│   └── swagger.yaml  # Swagger API文档
└── README.md         # 项目说明
```

## 🚀 快速开始

### 1. 启动后端服务

```bash
cd back_end
go mod tidy
go run main.go
```

后端服务将在 http://localhost:8080 启动

### 2. 启动前端应用

```bash
cd front_end
npm install
npm start
```

前端应用将在 http://localhost:3000 启动

### 3. 查看API文档

打开 `docs/swagger.yaml` 文件，或使用Swagger UI查看API文档。

## 📋 功能特性

### 后端功能
- ✅ 用户注册（邮箱验证）
- ✅ 用户登录（JWT认证）
- ✅ 密码重置
- ✅ 邮箱验证
- ✅ 个人资料管理
- ✅ 角色权限控制
- ✅ 数据库集成（PostgreSQL）
- ✅ 邮件发送功能
- ✅ 日志记录
- ✅ 错误处理

### 前端功能
- ✅ 响应式用户界面
- ✅ 用户注册/登录表单
- ✅ 个人资料管理
- ✅ 密码重置流程
- ✅ 邮箱验证界面
- ✅ 仪表板展示
- ✅ 实时表单验证
- ✅ 通知系统
- ✅ 路由保护

## 🛠️ 技术栈

### 后端技术
- **Golang** - 编程语言
- **Gin** - Web框架
- **GORM** - ORM框架
- **PostgreSQL** - 数据库
- **JWT** - 身份认证
- **bcrypt** - 密码加密
- **Swagger** - API文档

### 前端技术
- **React 18** - 前端框架
- **React Router** - 路由管理
- **Axios** - HTTP客户端
- **React Toastify** - 通知组件
- **FontAwesome** - 图标库
- **CSS3** - 样式设计

## 📱 界面预览

### HTML原型界面
打开 `front_end/prototype.html` 查看完整的界面原型设计，包含：
- 登录界面
- 注册界面
- 仪表板
- 个人资料
- 密码管理
- 邮箱验证

### 设计特色
- 🎨 现代简洁的UI设计
- 📱 响应式布局，支持移动端
- 🎯 用户友好的交互体验
- 🔒 安全的认证流程
- ⚡ 快速的响应速度

## 🔧 配置说明

### 数据库配置
在 `back_end/config/config.yaml` 中配置数据库连接：
```yaml
database:
  host: localhost
  port: 5432
  user: postgres
  password: your_password
  dbname: newworld_db
```

### 邮件配置
在 `back_end/config/config.yaml` 中配置邮件服务：
```yaml
email:
  host: smtp.gmail.com
  port: 587
  username: your_email@gmail.com
  password: your_app_password
```

### 前端配置
在 `front_end/package.json` 中配置API代理：
```json
{
  "proxy": "http://localhost:8080"
}
```

## 📝 API接口

### 认证接口
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/logout` - 用户登出
- `POST /api/v1/auth/verify-email` - 邮箱验证
- `POST /api/v1/auth/forgot-password` - 忘记密码
- `POST /api/v1/auth/reset-password` - 重置密码

### 用户接口
- `GET /api/v1/users/profile` - 获取用户资料
- `PUT /api/v1/users/profile` - 更新用户资料
- `POST /api/v1/users/change-password` - 修改密码

## 🚀 部署指南

### Docker部署
```bash
# 构建后端镜像
cd back_end
docker build -t newworld-backend .

# 构建前端镜像
cd ../front_end
docker build -t newworld-frontend .

# 使用docker-compose启动
docker-compose up -d
```

### 手动部署
1. 配置数据库和邮件服务
2. 构建后端：`go build -o main main.go`
3. 构建前端：`npm run build`
4. 部署到服务器

## 🧪 测试

### 后端测试
```bash
cd back_end
go test ./...
```

### 前端测试
```bash
cd front_end
npm test
```

### API测试
使用提供的测试脚本：
- `back_end/test_api.sh` (Linux/Mac)
- `back_end/test_api.bat` (Windows)

## 📚 文档

- [后端开发文档](back_end/README.md)
- [前端开发文档](front_end/README.md)
- [API文档](docs/swagger.yaml)
- [部署指南](docs/deployment.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目链接: [https://github.com/your-username/newworld-project](https://github.com/your-username/newworld-project)
- 问题反馈: [Issues](https://github.com/your-username/newworld-project/issues)

---

**NewWorld Project** - 构建安全可靠的用户认证系统 🚀 