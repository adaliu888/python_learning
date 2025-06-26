# NewWorld Project - React Frontend

基于React和TypeScript构建的现代化用户认证系统前端应用。

## 🚀 功能特性

### 核心功能
- **用户注册**: 邮箱验证注册流程，确保用户身份真实性
- **用户登录**: 支持邮箱/用户名登录，JWT令牌认证
- **个人资料**: 完整的个人信息管理功能
- **密码安全**: 密码修改、重置，多重安全验证
- **仪表板**: 用户主界面，显示统计信息和快速操作

### 技术特色
- **TypeScript**: 完整的类型安全
- **React Router**: 现代化路由管理
- **React Hook Form**: 高性能表单处理
- **Yup**: 强大的表单验证
- **Lucide React**: 现代化图标库
- **响应式设计**: 支持移动端和桌面端

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── Navbar.tsx      # 导航栏组件
│   └── PrivateRoute.tsx # 路由保护组件
├── contexts/           # React Context
│   └── AuthContext.tsx # 认证上下文
├── pages/              # 页面组件
│   ├── Login.tsx       # 登录页面
│   ├── Register.tsx    # 注册页面
│   ├── Dashboard.tsx   # 仪表板页面
│   └── Profile.tsx     # 个人资料页面
├── services/           # API服务
│   └── api.ts          # API请求封装
├── types/              # TypeScript类型定义
│   └── api.ts          # API相关类型
└── utils/              # 工具函数
```

## 🛠️ 技术栈

- **React 18**: 现代化的React框架
- **TypeScript**: 类型安全的JavaScript
- **React Router v6**: 路由管理
- **React Hook Form**: 表单处理
- **Yup**: 表单验证
- **Axios**: HTTP客户端
- **Lucide React**: 图标库

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 启动。

### 构建生产版本

```bash
npm run build
```

## 🔧 环境配置

创建 `.env` 文件并配置以下环境变量：

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api/v1
```

## 📱 页面说明

### 登录页面 (`/login`)
- 支持邮箱或用户名登录
- 记住我功能
- 表单验证
- 错误处理

### 注册页面 (`/register`)
- 完整的用户注册表单
- 实时表单验证
- 邮箱验证流程
- 服务条款同意

### 仪表板 (`/dashboard`)
- 用户欢迎信息
- 统计卡片展示
- 快速操作入口
- 响应式布局

### 个人资料 (`/profile`)
- 个人信息编辑
- 头像显示
- 表单验证
- 实时保存

## 🔐 认证流程

1. **注册**: 用户填写注册信息 → 后端验证 → 发送验证邮件
2. **登录**: 用户输入凭据 → JWT认证 → 存储令牌
3. **访问**: 受保护路由检查令牌 → 自动刷新 → 用户访问
4. **登出**: 清除本地存储 → 调用登出API → 重定向登录

## 🎨 设计系统

### 颜色方案
- **主色调**: `#667eea` (渐变到 `#764ba2`)
- **成功色**: `#28a745`
- **错误色**: `#dc3545`
- **警告色**: `#ffc107`
- **信息色**: `#17a2b8`

### 组件样式
- 现代化的卡片设计
- 渐变背景
- 圆角边框
- 阴影效果
- 悬停动画

## 📱 响应式设计

- **桌面端**: 完整功能展示
- **平板端**: 适配中等屏幕
- **移动端**: 优化触摸体验

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/` 创建新组件
2. 在 `src/App.tsx` 添加路由
3. 更新导航栏（如需要）

### 添加新API

1. 在 `src/types/api.ts` 定义类型
2. 在 `src/services/api.ts` 添加API方法
3. 在组件中使用

### 样式指南

- 使用内联样式保持组件独立性
- 遵循设计系统的颜色和间距
- 确保响应式兼容性

## 🐛 故障排除

### 常见问题

1. **API连接失败**
   - 检查后端服务是否运行
   - 确认API基础URL配置

2. **认证问题**
   - 清除浏览器本地存储
   - 检查JWT令牌有效性

3. **路由问题**
   - 确认React Router版本
   - 检查路由配置

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

**NewWorld Project Team** - 构建更好的用户体验
