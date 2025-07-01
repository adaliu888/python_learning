#!/usr/bin/env python3
"""
示例脚本：演示一个简单的 Python 应用
"""

def main():
    """主函数"""
    print("Hello from example.py!")
    print("这是一个使用 uv 运行的示例脚本")
    
    # 简单计算
    numbers = [1, 2, 3, 4, 5]
    total = sum(numbers)
    average = total / len(numbers)
    
    print(f"数字列表: {numbers}")
    print(f"总和: {total}")
    print(f"平均值: {average}")

if __name__ == "__main__":
    main() 