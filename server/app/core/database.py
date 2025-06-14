import databases
import sqlalchemy
import redis

from app.core.config import config


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
is_testing = config.ENV_STATE == "test"

redis_host = "localhost" if is_testing else config.REDIS_HOST

scheme = "rediss" if config.REDIS_SSL else "redis"
redis_url = f"{scheme}://:{config.REDIS_PASSWORD}@{redis_host}:{config.REDIS_PORT}/{config.REDIS_DB}"

redis_client = redis.StrictRedis.from_url(redis_url, decode_responses=True)
