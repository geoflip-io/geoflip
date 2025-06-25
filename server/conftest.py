import os
os.environ["ENV_STATE"] = "test"

pytest_plugins = ["celery.contrib.pytest"]          # ❶ keep at top

from typing import AsyncGenerator, Generator
import pytest
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient
from app.core.database import database, user_table
from app.core.celery_worker import celery_app as real_celery_app
from app.main import app

# ---------- FastAPI helpers ----------

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest.fixture()
def client() -> Generator:
    yield TestClient(app)

@pytest.fixture(autouse=True)
async def db() -> AsyncGenerator:
    await database.connect()
    yield
    await database.disconnect()

@pytest.fixture()
async def async_client(client) -> AsyncGenerator:
    async with AsyncClient(transport=ASGITransport(app),
                           base_url=client.base_url) as ac:
        yield ac

# ---------- Users ----------

@pytest.fixture()
async def registered_user(async_client: AsyncClient) -> dict:
    creds = {"email": "test@example.net", "password": "1234"}
    await async_client.post("/register", json=creds)
    row = await database.fetch_one(
        user_table.select().where(user_table.c.email == creds["email"])
    )
    creds["id"] = row.id
    return creds

@pytest.fixture()
async def logged_in_token(async_client: AsyncClient, registered_user):
    resp = await async_client.post("/token", json=registered_user)
    return resp.json()["access_token"]

# ---------- Celery ----------

@pytest.fixture(scope="session")
def celery_config():
    return {
        "broker_url": "memory://",
        "result_backend": "cache+memory://",
        "task_always_eager": False,
        "task_eager_propagates": True,
    }

@pytest.fixture(scope="session")
def celery_worker_parameters():
    return {"perform_ping_check": False}

@pytest.fixture(scope="session")
def celery_app():
    real_celery_app.conf.update(task_default_queue="test-queue")
    # ← new — make sure built-in control tasks are loaded
    real_celery_app.loader.import_default_modules()
    return real_celery_app
