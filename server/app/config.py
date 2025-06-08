from functools import lru_cache
from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseConfig(BaseSettings):
    ENV_STATE: Optional[str] = None
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


class GlobalConfig(BaseConfig):
    DB_USER: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: int
    DB_NAME: str
    DB_FORCE_ROLL_BACK: bool = False
    DATABASE_URL: str = ""

    JWT_SECRET: str
    FRONTEND_URL: str
    BACKEND_URL: str
    DATA_PATH: str

    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_DB: int
    REDIS_PASSWORD: str
    REDIS_SSL: bool = False

    JOB_EXPIRY_TIME: int = 3600

    model_config = SettingsConfigDict(env_prefix="")

    def __init__(self, **values):
        super().__init__(**values)
        self.DATABASE_URL = f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"


class DevConfig(GlobalConfig):
    DB_FORCE_ROLL_BACK: bool = True


class TestConfig(GlobalConfig):
    TEST_DB_NAME: str = "test-db"
    DB_FORCE_ROLL_BACK: bool = True

    def __init__(self, **values):
        super().__init__(**values)
        self.DATABASE_URL = f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.TEST_DB_NAME}"


@lru_cache()
def get_config(env_state: str):
    match env_state:
        case "test":
            return TestConfig()
        case "dev":
            return DevConfig()
        case _:
            return GlobalConfig()


config = get_config(BaseConfig().ENV_STATE)
