import pytest
from app import security
from jose import jwt

def test_access_token_expire_minutes():
    assert security.access_token_expire_minutes() == 30

def test_create_access_token():
    token = security.create_access_token("123")
    assert {"sub": "123"}.items() <= jwt.decode(
        token, key=security.SECRET_KEY, algorithms=[security.ALGORITHM]
    ).items()

def test_password_hashes():
    password = "password"
    assert security.verify_password(password, security.get_password_hash(password))


@pytest.mark.anyio
async def test_get_user(registered_user: dict):
    # calling the registered_user dependancy will run the fixture which will create a user
    user = await security.get_user(registered_user["email"])

    assert user.email == registered_user["email"]


@pytest.mark.anyio
async def test_get_user_not_found(registered_user: dict):
    user = await security.get_user("not@a.user")

    assert user is None

@pytest.mark.anyio
async def test_authenticate_user(registered_user: dict):
    user = await security.authenticate_user(
        registered_user["email"], 
        registered_user["password"]
    )
    assert user.email == registered_user["email"]

@pytest.mark.anyio
async def test_authenticate_user_not_found():
    with pytest.raises(security.HTTPException):
        await security.authenticate_user(
            "test@user.com", 
            "password"
        )

@pytest.mark.anyio
async def test_authenticate_user_wrong_pass(registered_user: dict):
    with pytest.raises(security.HTTPException):
        await security.authenticate_user(
            registered_user["email"], 
            "wrong password"
        )

@pytest.mark.anyio
async def test_get_current_user(registered_user: dict):
    token = security.create_access_token(registered_user["email"])
    user = await security.get_current_user(token)
    assert user.email == registered_user["email"]

@pytest.mark.anyio
async def test_get_current_user_invalid_token():
    with pytest.raises(security.HTTPException):
        await security.get_current_user("invalid token")