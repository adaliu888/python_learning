"""
数据库初始化脚本
"""
import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

# 添加父目录到路径，以便导入 config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from full_stack.config import settings

def init_db():
    """初始化数据库"""
    # 连接到默认的 postgres 数据库
    postgres_url = f"postgresql://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_SERVER}/postgres"
    engine = create_engine(postgres_url)
    
    # 创建数据库
    try:
        with engine.connect() as conn:
            conn.execute(text("COMMIT"))  # 结束任何可能存在的事务
            
            # 检查数据库是否存在
            result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname = '{settings.POSTGRES_DB}'"))
            exists = result.scalar() is not None
            
            if not exists:
                print(f"创建数据库 {settings.POSTGRES_DB}...")
                conn.execute(text(f"CREATE DATABASE {settings.POSTGRES_DB}"))
                print(f"数据库 {settings.POSTGRES_DB} 创建成功")
            else:
                print(f"数据库 {settings.POSTGRES_DB} 已存在")
    except OperationalError as e:
        print(f"连接错误: {e}")
        print("请确保 PostgreSQL 服务正在运行，并且用户名和密码正确")
        return False
    
    # 连接到新创建的数据库并创建表
    try:
        from full_stack.database import engine as app_engine
        from full_stack.models import Base
        
        print("创建表...")
        Base.metadata.create_all(bind=app_engine)
        print("表创建成功")
        return True
    except Exception as e:
        print(f"创建表时出错: {e}")
        return False

if __name__ == "__main__":
    print("初始化数据库...")
    success = init_db()
    if success:
        print("数据库初始化成功")
    else:
        print("数据库初始化失败")
        sys.exit(1) 