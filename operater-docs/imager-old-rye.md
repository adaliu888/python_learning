# 将pip管理项目迁移到rye的步骤

## 1. 准备工作
- 确保已安装rye（如果没有安装，使用`curl -sSf https://rye-up.com/get | bash`安装）
- 确保您有一个现有的pip管理的项目

## 2. 收集现有项目信息
```
cd 现有项目目录
pip freeze > requirements_old.txt
```

## 3. 初始化rye项目
如果要在现有目录中初始化：
```
cd 现有项目目录
rye init --existing
```

或创建新项目：
```
rye init 项目名称
cd 项目名称
```

## 4. 配置项目依赖
将原有的依赖添加到rye中：
```
cat requirements_old.txt | xargs -I {} rye add "{}"
```
或手动添加关键依赖：
```
rye add 依赖包名
rye add 依赖包名==版本号
```

## 5. 配置开发依赖
添加开发环境专用依赖：
```
rye add --dev pytest black flake8
```

## 6. 同步项目
```
rye sync
```

## 7. 确认项目结构
- 检查`pyproject.toml`文件是否包含所有必要依赖
- 确认`src/项目名/`目录结构是否正确
- 验证`.python-version`和`.gitignore`文件

## 8. 测试运行
```
rye run python -c "import 您的模块"
```

成功迁移后，您可以使用`rye run`命令运行脚本，使用`rye sync`更新依赖。