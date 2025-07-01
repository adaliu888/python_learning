# rye-myproject

使用 Rye 和 UV 管理的 Python 项目

## UV 使用指南

本项目已集成 UV（Ultra-fast Python package manager）作为包管理工具。UV 是一个高性能的 Python 包管理器，比传统的 pip 更快。

### 使用本地 UV 可执行文件

项目中已包含 UV 的可执行文件：
- `uv.exe` - 主要的 UV 可执行文件
- `uvx.exe` - UV 的辅助可执行文件

你可以直接使用这些可执行文件，例如：

```bash
# 查看 UV 版本
./uv.exe --version

# 安装包
./uv.exe pip install requests

# 创建虚拟环境
./uv.exe venv .venv

# 同步项目依赖
./uv.exe sync
```

### 使用 UV 帮助脚本

为了更方便地使用 UV，我们提供了一个 Python 帮助脚本 `uv_helper.py`：

```bash
# 查看帮助
python uv_helper.py

# 查看 UV 版本
python uv_helper.py version

# 安装包
python uv_helper.py install requests

# 创建虚拟环境
python uv_helper.py venv

# 同步项目依赖
python uv_helper.py sync

# 运行脚本
python uv_helper.py run example.py

# 设置更长的超时时间（例如 120 秒）
python uv_helper.py --timeout 120 install pandas
```

### 常见问题解决

#### 硬链接警告

如果你看到以下警告：
```
warning: Failed to hardlink files; falling back to full copy. This may lead to degraded performance.
```

这是因为 UV 默认尝试使用硬链接来提高性能，但在某些文件系统上可能不支持。我们的帮助脚本已经默认设置为使用复制模式，所以你不会看到这个警告。

如果你直接使用 `uv.exe`，可以添加 `--link-mode=copy` 参数或设置环境变量 `UV_LINK_MODE=copy`。

#### 网络超时

如果你遇到网络超时问题：
```
Failed to download distribution due to network timeout.
```

你可以使用帮助脚本的 `--timeout` 参数设置更长的超时时间：
```bash
python uv_helper.py --timeout 120 install pandas
```

或者设置环境变量 `UV_HTTP_TIMEOUT=120`。

### 示例

项目中包含一个简单的示例脚本 `example.py`，你可以使用以下命令运行它：

```bash
# 使用 Python 直接运行
python example.py

# 使用 UV 运行
./uv.exe run example.py

# 使用帮助脚本运行
python uv_helper.py run example.py
```

## 项目结构

```
rye-myproject/
├── .venv/                # 虚拟环境目录
├── src/                  # 源代码目录
├── uv.exe                # UV 可执行文件
├── uvx.exe               # UV 辅助可执行文件
├── uv_helper.py          # UV 帮助脚本
├── example.py            # 示例脚本
├── test_uv.py            # UV 测试脚本
├── pyproject.toml        # 项目配置文件
└── README.md             # 项目说明文件
```
