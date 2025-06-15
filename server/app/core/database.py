import databases
import sqlalchemy
import redis

from app.core.config import config


# Database connection and ORM setup
metadata = sqlalchemy.MetaData()

# ---------- Tenants Table ----------
tenants_table = sqlalchemy.Table(
    "tenants",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True, autoincrement=True),
    sqlalchemy.Column("name", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("provider_type", sqlalchemy.String),         # e.g., 'azure_ad', 'github'
    sqlalchemy.Column("provider_tenant_id", sqlalchemy.String),    # e.g., Microsoft tenant GUID
    sqlalchemy.Column("email_domain", sqlalchemy.String),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now()),
)

# ---------- Users Table ----------
user_table = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True, autoincrement=True),
    sqlalchemy.Column("email", sqlalchemy.String, unique=True, nullable=False),
    sqlalchemy.Column("password", sqlalchemy.String),              # null for SSO or public users
    sqlalchemy.Column("role", sqlalchemy.String, server_default="user"), # always 'admin' in Open
    sqlalchemy.Column("tenant_id", sqlalchemy.Integer, sqlalchemy.ForeignKey("tenants.id"), nullable=False),
    sqlalchemy.Column("created_at", sqlalchemy.DateTime, server_default=sqlalchemy.func.now()),
)

# ---------- Usage Logs Table ----------
usage_logs_table = sqlalchemy.Table(
    "usage_logs",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True, autoincrement=True),
    sqlalchemy.Column("tenant_id", sqlalchemy.Integer, sqlalchemy.ForeignKey("tenants.id"), nullable=False),
    sqlalchemy.Column("user_id", sqlalchemy.Integer, sqlalchemy.ForeignKey("users.id"), nullable=False),
    sqlalchemy.Column("endpoint", sqlalchemy.String, nullable=False),
    sqlalchemy.Column("request_time", sqlalchemy.DateTime, server_default=sqlalchemy.func.now()),
    sqlalchemy.Column("success", sqlalchemy.Boolean),
    sqlalchemy.Column("payload_size_bytes", sqlalchemy.Integer),
    sqlalchemy.Column("client_ip", sqlalchemy.String),
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
