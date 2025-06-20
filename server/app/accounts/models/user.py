from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class User(BaseModel):
    id: Optional[int]
    email: str
    password: str
    role: str
    tenant_id: int
    created_at: Optional[datetime]

class UserIn(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    role: str
    tenant_id: int
    created_at: Optional[datetime]
