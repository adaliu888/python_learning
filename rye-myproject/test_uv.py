#!/usr/bin/env python3
"""
测试脚本：演示如何在项目中使用 uv
"""

import subprocess
import sys
import os

def run_uv_command(command):
    """运行 uv 命令"""
    try:
        # 获取当前脚本所在目录
        current_dir = os.path.dirname(os.path.abspath(__file__))
        uv_path = os.path.join(current_dir, "uv.exe")
        
        # 构建完整命令
        full_command = [uv_path] + command.split()
        
        # 运行命令
        result = subprocess.run(full_command, capture_output=True, text=True)
        
        print(f"命令: {' '.join(full_command)}")
        print(f"返回码: {result.returncode}")
        print(f"输出: {result.stdout}")
        if result.stderr:
            print(f"错误: {result.stderr}")
            
        return result
    except Exception as e:
        print(f"运行 uv 命令时出错: {e}")
        return None

def main():
    """主函数"""
    print("=== UV 测试脚本 ===")
    
    # 测试 uv 版本
    print("\n1. 检查 uv 版本:")
    run_uv_command("--version")
    
    # 测试帮助命令
    print("\n2. 查看 uv 帮助:")
    run_uv_command("--help")

if __name__ == "__main__":
    main() 