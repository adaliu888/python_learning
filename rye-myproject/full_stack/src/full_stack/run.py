"""
运行脚本
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run("full_stack.main:app", host="0.0.0.0", port=8000, reload=True) 