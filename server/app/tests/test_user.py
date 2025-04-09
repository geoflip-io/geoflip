import pytest
from httpx import AsyncClient


async def register_user(async_client: AsyncClient, email: str, password: str):
    return await async_client.post(
        "/register", json={"email": email, "password": password}
    )


@pytest.mark.anyio
async def test_register_user(async_client: AsyncClient):
    response = await register_user(async_client, "test@example.com", "1234")
    assert response.status_code == 201
    assert "User Created" in response.json()["detail"]


@pytest.mark.anyio
async def test_user_exists(async_client: AsyncClient, registered_user: dict):
    response = await register_user(async_client, registered_user["email"], "1234")
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


@pytest.mark.anyio
async def test_user_not_exists(async_client: AsyncClient):
    response = await async_client.post(
        "/token",
        json={
            "email":"whatever@test.com",
            "password":"something"
        }
    )
    assert response.status_code == 401

@pytest.mark.anyio
async def test_token(async_client: AsyncClient, registered_user: dict):
    response = await async_client.post(
        "/token",
        json={
            "email":registered_user["email"],
            "password":registered_user["password"]  
        }
    )
    assert response.status_code == 200
    assert response.json()["token_type"] == "bearer"

@pytest.mark.anyio
async def test_get_user(async_client: AsyncClient, registered_user: dict, logged_in_token: str):
    response = await async_client.get(
        "/user",
        headers={"Authorization": f"Bearer {logged_in_token}"},
    )
    user = response.json()
    assert registered_user["email"] == user["email"]