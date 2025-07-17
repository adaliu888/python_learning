rye toolchain list --include-downloadable   --


自 2025 年 2 月发布 0.44 版后，Rye 项目再无更新。Rye 项目之后可能会不再更新，其功能将合并进 uv 项目中。

增订于2025年4月10日
涉及 Python 环境及包管理的工具七七八八加起来不下于十几种，看得人眼花缭乱。以至于患有选择困难症的本人还在坚持使用最原始 pip + venv 来构建 Python 运行环境。为了与时俱进，经过多方比较，最后选择了 Rye 作为今后的主力生产工具了。

题外话
本来还有一个和 Rye 类似叫做 PDM 的备选工具。最后之所以选择了 Rye 基于以下几点原因：

Rye 可以通过 Scoop 命令直接安装，而 PDM 不支持（可以通过添加第三方 bucket 进行安装）；
Rye 支持使用性能更好的 uv 作为包安装器；
Rye 支持类似于 pipx 的全局安装，并且安装的 Python 工具可以直接运行，而 PDM 需要使用 pdm run -g <pkg> 命令来运行；
Rye 采用 rust 语言编写，性能优于采用 Python 编写 PDM。
安装和配置
使用 Scoop 进行安装 Rye 和其他相关工具：

shell
scoop install rye uv ruff
列出所有可用的 Python 版本：

shell
rye toolchain list --include-downloadable
这里选择安装 CPython 3.10 ~ 3.12 的版本：

shell
rye toolchain fetch cpython@3.10.13
rye toolchain fetch cpython@3.11.8
rye toolchain fetch cpython@3.12.2
启用 uv 后端
可选步骤。uv 是一款用 Rust 编写的，性能优秀的 Python 包安装和解析工具，被设计用于替代 pip 和 pip-tools。

shell
rye config --set-bool behavior.use-uv=true
设置代理服务器
可选步骤。

shell
rye config --set proxy.http=http://127.0.0.1:7890
rye config --set proxy.https=http://127.0.0.1:7890
添加 PyPi 镜像
使用 rye config --show-path 命令取得配置文件路径。用文本编辑器打开配置文件，并添加如下内容：

toml
[[sources]]
name = "default"
url = "https://mirrors.aliyun.com/pypi/simple/"
此外，也可以在项目文件 pyproject.toml 中进行设置：

toml
[[tool.rye.sources]]
name = "default"
url = "https://mirrors.aliyun.com/pypi/simple/"
初始化项目
初始化一个名为 ryetest 的项目，并指定使用的 Python 版本：

shell
rye init -p cpython@3.10 ryetest
或对于已经创建的文件夹：

shell
mkdir ryetest
cd ryetest
rye init -p cpython@3.10
默认项目是 Lib 模式，如果要创建一个可执行命令项目，可以使用如下命令：

shell
rye init --script
Python 版本管理
可以在项目创建后更改项目使用的 Python 版本：

shell
rye pin cpython@3.12
执行该命令后，只会修改当前项目下的 .python-version 文件。如果此前已经创建了 Python 虚拟环境，则需要执行下面的命令来同步修改虚拟环境中的 Python 版本：

shell
rye sync
通过上述两个命令，可以方便地切换虚拟环境使用的 Python 版本。

项目版本管理
项目初始化后默认版本是 0.1.0。可以通过 rye version 命令来对项目版本进行管理。通过下面的命令可以让 pyproject.toml 中定义的版本号实现自增：

shell
rye version -b major
rye version -b minor
rye version -b patch
遵循语义化规则的版本号由三部分组成，由 . 分隔，按照顺序分别是主版本号、次版本号和阶段版本号，形式如 X.Y.Z。上面命令中，major 自增主版本号；minor 自增次版本号；patch 自增阶段版本号。比如默认版本号 0.1.0 通过命令 rye version -b patch 修改后就变成了 0.1.1。

安装依赖包
安装一个或多个包：

shell
rye add NumPy Pandas
在开发环境中安装包：

shell
rye add --dev pytest
从 git 源安装包：

shell
rye add FastAPI --git https://github.com/tiangolo/fastapi
从本地路径安装包：

shell
rye add MyPyPkg --path ~/mypypkg
运行测试
需要先在开发环境中安装 pytest：

shell
rye add --dev pytest
使用下面的运行测试代码：

shell
rye test
此命令等价于 rye run pytest，不过不支持将测试脚本路径作为参数传递。

测试脚本默认存放在项目路径 tests 目录下，也可以在 pyproject.toml 中指定测试脚本路径：

toml
[tool.pytest.ini_options]
testpaths = ["tests", "opt_tests/opt.py", ]
构建和发布
shell
rye build
rye publish
发布时需要输入 PyPi 的身份验证 token。

全局安装 Python 工具
此功能和 pipx 类似。Windows 下安装的 Rye 默认会将其 shims 路径添加到 PATH 环境变量，因此通过 Rye 全局安装的 Python 工具可以在命令行中直接运行。

全局安装 PDM：

shell
rye install pdm
删除全局安装的 PDM：

shell
rye uninstall pdm
列出全局安装的所有工具：

shell
rye tools list
制作 Docker 镜像
项目在初始化时需要使用 --virtual 参数，或者在 pyproject.toml 文件的 [tool.rye] 小节中设置 virtual = true。

具体步骤参考官方文档《Building a Container with Docker》。

没想到才用了没几次就开始作妖了。自从 Rye 某次更新后运行 rye build 就会报错：

Bootstrapping rye internals
Downloading cpython@3.12.3
Checking checksum
Unpacking
error: could not sync because bootstrap failed
 
Caused by:
    0: failed to fetch internal cpython toolchain cpython@3.12
    1: unable to persist download (at '$persist_dir\py\cpython@3.12.3')
    2: 拒绝访问。 (os error 5)
根据该 issue 下的解决方案，清除环境变量 RYE_HOME 就正常了。Rye 还真是经不起夸啊。

Rye 0.37 已经修复了这个问题，响应速度还是挺快的。不过即便如此，这个问题也存在了大约一个月左右的时间。该 BUG 是安装脚本的平台兼容性问题引起的，Linux 不受影响。在错误的 Windows 版本中，Rye 安装后生成的环境变量 RYE_HOME 的值是 $persist_dir，而这个 $persist_dir 显然是某个变量的名称，而非真正的 Rye 安装路径。