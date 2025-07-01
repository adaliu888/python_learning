#!/usr/bin/env python3
"""
UV 帮助工具：提供在项目中使用本地 uv.exe 的便捷方法
"""

import subprocess
import sys
import os
import argparse

# 获取当前脚本所在目录
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
UV_PATH = os.path.join(CURRENT_DIR, "uv.exe")

# UV 默认参数，用于解决常见问题
DEFAULT_UV_ARGS = ["--link-mode=copy"]

# 设置环境变量
def set_uv_env_vars(timeout=60):
    """设置 UV 相关的环境变量
    
    Args:
        timeout: HTTP 超时时间（秒）
    """
    os.environ["UV_LINK_MODE"] = "copy"  # 设置链接模式为复制
    os.environ["UV_HTTP_TIMEOUT"] = str(timeout)  # 设置 HTTP 超时时间

def run_uv_command(command_args, capture_output=True, timeout=60):
    """运行 uv 命令
    
    Args:
        command_args: 命令参数列表
        capture_output: 是否捕获输出
        timeout: HTTP 超时时间（秒）
    
    Returns:
        subprocess.CompletedProcess 对象
    """
    try:
        # 设置环境变量
        set_uv_env_vars(timeout)
        
        # 构建完整命令，添加默认参数
        full_command = [UV_PATH] + DEFAULT_UV_ARGS + command_args
        
        if capture_output:
            result = subprocess.run(full_command, capture_output=True, text=True)
            return result
        else:
            # 直接显示输出到控制台
            return subprocess.run(full_command)
            
    except Exception as e:
        print(f"运行 uv 命令时出错: {e}")
        return None

def install_package(package_name, timeout=60):
    """安装包
    
    Args:
        package_name: 包名称
        timeout: HTTP 超时时间（秒）
    """
    print(f"正在安装 {package_name}...")
    return run_uv_command(["pip", "install", package_name], capture_output=False, timeout=timeout)

def create_venv(venv_path=".venv", timeout=60):
    """创建虚拟环境
    
    Args:
        venv_path: 虚拟环境路径
        timeout: HTTP 超时时间（秒）
    """
    print(f"正在创建虚拟环境 {venv_path}...")
    return run_uv_command(["venv", venv_path], capture_output=False, timeout=timeout)

def sync_dependencies(timeout=60):
    """同步项目依赖
    
    Args:
        timeout: HTTP 超时时间（秒）
    """
    print("正在同步项目依赖...")
    return run_uv_command(["sync"], capture_output=False, timeout=timeout)

def run_script(script_args, timeout=60):
    """运行脚本
    
    Args:
        script_args: 脚本参数列表
        timeout: HTTP 超时时间（秒）
    """
    print(f"正在运行: {' '.join(script_args)}")
    return run_uv_command(["run"] + script_args, capture_output=False, timeout=timeout)

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description="UV 帮助工具")
    
    # 全局参数
    parser.add_argument("--timeout", type=int, default=60, 
                        help="HTTP 超时时间（秒），默认为 60 秒")
    
    subparsers = parser.add_subparsers(dest="command", help="命令")
    
    # 版本命令
    version_parser = subparsers.add_parser("version", help="显示 UV 版本")
    
    # 安装包命令
    install_parser = subparsers.add_parser("install", help="安装包")
    install_parser.add_argument("package", help="包名称")
    
    # 创建虚拟环境命令
    venv_parser = subparsers.add_parser("venv", help="创建虚拟环境")
    venv_parser.add_argument("--path", default=".venv", help="虚拟环境路径")
    
    # 同步依赖命令
    sync_parser = subparsers.add_parser("sync", help="同步项目依赖")
    
    # 运行脚本命令
    run_parser = subparsers.add_parser("run", help="运行脚本")
    run_parser.add_argument("script_args", nargs=argparse.REMAINDER, help="脚本参数")
    
    args = parser.parse_args()
    
    # 设置超时时间
    timeout = args.timeout
    
    if args.command == "version":
        result = run_uv_command(["--version"], timeout=timeout)
        print(result.stdout)
    elif args.command == "install":
        install_package(args.package, timeout)
    elif args.command == "venv":
        create_venv(args.path, timeout)
    elif args.command == "sync":
        sync_dependencies(timeout)
    elif args.command == "run":
        run_script(args.script_args, timeout)
    else:
        parser.print_help()

if __name__ == "__main__":
    main() 