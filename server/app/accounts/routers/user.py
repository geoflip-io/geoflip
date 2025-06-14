import logging
from typing import Annotated

from fastapi import APIRouter, HTTPException, Depends

from app.core.database import database, user_table
from app.accounts.models.user import UserIn, User
from app.core.security import get_user, get_password_hash, authenticate_user, create_access_token, get_current_user

router = APIRouter()
logger = logging.getLogger("api")


@router.post("/register", status_code=201)
async def register(user: UserIn):
    # if a user is returned then the email aready exists
    if await get_user(user.email):
        raise HTTPException(
            status_code=400, detail="A user with that email already exists"
        )

    hashed_password = get_password_hash(user.password)
    query = user_table.insert().values(email=user.email, password=hashed_password)
    logger.debug(query)

    await database.execute(query)

    return {"detail": "User Created."}


@router.post("/token", status_code=200)
async def login(user: UserIn):
    user = await authenticate_user(user.email, user.password)
    access_token = create_access_token(user.email)
    return {"access_token": access_token, "token_type": "bearer"}


# protect a route by requiring the current user
@router.get("/user", response_model=User, status_code=200)
async def get_user_by_id(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user

