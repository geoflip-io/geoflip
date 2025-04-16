import databases
import sqlalchemy
import os
import redis

from app.config import config


# Database connection and ORM setup
metadata = sqlalchemy.MetaData()

user_table = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("email", sqlalchemy.String, unique=True),
    sqlalchemy.Column("password", sqlalchemy.String),
)

DATABASE_URL = config.DATABASE_URL
DB_FORCE_ROLL_BACK = config.DB_FORCE_ROLL_BACK

engine = sqlalchemy.create_engine(DATABASE_URL)

metadata.create_all(engine)

database = databases.Database(DATABASE_URL, force_rollback=DB_FORCE_ROLL_BACK, min_size=1, max_size=5)


# Redis connection setup
is_testing = os.getenv("ENV_STATE") == "test"

redis_host = "localhost" if is_testing else os.getenv("REDIS_HOST")
redis_port = os.getenv("REDIS_PORT", 6379)
redis_db = os.getenv("REDIS_DB", 0)
redis_password = os.getenv("REDIS_PASSWORD")
redis_ssl = os.getenv("REDIS_SSL", "False")

scheme = "rediss" if redis_ssl == "True" else "redis"
redis_url = f"{scheme}://:{redis_password}@{redis_host}:{redis_port}/{redis_db}"

redis_client = redis.StrictRedis.from_url(redis_url, decode_responses=True)
