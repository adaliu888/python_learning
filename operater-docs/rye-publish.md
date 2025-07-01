# Rye 项目发布操作指南

## 1. 准备工作

首先确保您的项目已经准备好发布：

1. 检查 `pyproject.toml` 文件配置
```bash
# 确保以下信息正确配置：
- name
- version
- description
- authors
- dependencies
- readme
- license
```

2. 更新版本号
```bash
rye version bump [major|minor|patch]
# 或直接修改 pyproject.toml 中的 version
```

## 2. 构建项目

```bash
# 构建项目
rye build

# 构建后会在 dist/ 目录生成以下文件：
- *.whl (wheel 格式)
- *.tar.gz (源码分发格式)
```

## 3. 配置发布设置

### 3.1 配置 PyPI 凭证

```bash
# 设置 PyPI token
rye config --auth-token pypi <your-token>

# 或设置测试 PyPI
rye config --auth-token testpypi <your-test-token>
```

### 3.2 选择发布仓库

- PyPI（生产环境）：https://pypi.org
- TestPyPI（测试环境）：https://test.pypi.org

## 4. 发布项目

```bash
# 发布到 PyPI
rye publish

# 发布到测试 PyPI
rye publish --repository testpypi

# 如果要跳过已存在的版本
rye publish --skip-existing
```

## 5. 发布检查清单

在发布之前，建议检查以下项目：

1. 文档完整性
   - README.md 是否完整
   - API 文档是否更新
   - 更新日志是否记录

2. 测试验证
   ```bash
   rye test  # 运行测试
   ```

3. 代码质量
   ```bash
   rye lint  # 运行代码检查
   ```

4. 依赖检查
   ```bash
   rye sync  # 确保依赖同步
   ```

## 6. 发布后验证

```bash
# 创建新的虚拟环境测试安装
python -m venv test_env
source test_env/bin/activate  # Linux/Mac
# 或
test_env\Scripts\activate  # Windows

# 安装发布的包
pip install your-package-name

# 验证安装是否成功
python -c "import your_package"
```

## 7. 常见问题处理

1. 版本冲突
```bash
# 如果版本已存在
rye version bump patch  # 增加补丁版本
rye publish
```

2. 认证失败
```bash
# 重新配置认证
rye config --auth-token pypi <new-token>
```

3. 构建失败
```bash
# 清理构建文件
rm -rf dist/ build/
rye build
```

## 8. 最佳实践

1. 使用语义化版本
   - MAJOR.MINOR.PATCH
   - 例如：1.0.0

2. 保持更新日志
   ```markdown
   ## [1.0.0] - 2024-03-XX
   ### Added
   - 新功能
   ### Changed
   - 改动
   ### Fixed
   - 修复
   ```

3. 使用 Git 标签标记版本
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

4. 发布前的测试流程
   - 先发布到 TestPyPI
   - 验证安装和功能
   - 确认无误后发布到 PyPI

这样的发布流程可以确保您的包能够顺利发布并被其他开发者使用。记得在每次发布前都要仔细检查配置和测试结果。