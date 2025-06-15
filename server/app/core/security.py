import logging
import datetime
from typing import Annotated
from jose import jwt, ExpiredSignatureError, JWTError
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from app.core.database import database, user_table
from app.core.config import config
from app.core.constants import OPEN_TENANT_ID, OPEN_USER_EMAIL, OPEN_USER_ROLE, OPEN_USER_ID

from app.accounts.models.user import User, UserOut


logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"])
SECRET_KEY = config.JWT_SECRET
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail = "Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"}
)

def access_token_expire_minutes() -> int:
    return 30

def create_access_token(email: str, role: str, tenant_id: int):
    logger.debug("Creating access token", extra={"id": email})
    expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=access_token_expire_minutes())
    jwt_data = {
        "sub": email,
        "exp": expire,
        "role": role,
        "tenant_id": tenant_id
    }
    encoded_jwt = jwt.encode(jwt_data, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


async def get_user(email: str):
    logger.debug("Fetching user from the database", extra={"email": email})
    query = user_table.select().where(user_table.c.email == email)
    result = await database.fetch_one(query)

    if result:
        return User(**result)

async def authenticate_user(email: str, password: str) -> dict:
    user = await get_user(email)
    if not user:
        raise credentials_exception
    if not verify_password(password, user.password):
        raise credentials_exception

    return user

async def get_current_user_secure(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, key=SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except ExpiredSignatureError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        ) from e
    except JWTError as e:
        raise credentials_exception from e

    user_data = await get_user(email=email)
    if user_data is None:
        raise credentials_exception

    return user_data

async def get_current_user(request: Request) -> User:
    if config.IS_PUBLIC_INSTANCE:
        return UserOut(
            id=OPEN_USER_ID,
            email=OPEN_USER_EMAIL,
            tenant_id=OPEN_TENANT_ID,
            role=OPEN_USER_ROLE,
            created_at=None
        )

    # Extract token manually
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise credentials_exception

    token = auth_header.split("Bearer ")[1]
    return await get_current_user_secure(token)


