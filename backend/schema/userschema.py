from pydantic import BaseModel, Field
from typing import Optional

class CreateUserSchema(BaseModel):
    email: str
    name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)
    
class CreateUserResponseSchema(BaseModel):
    success: bool
    message: str
    error: None

class UserLoginResponseSchema(BaseModel):
    id: int
    email: str
    name: str
    appwrite_token: str

class UserLoginSchema(BaseModel):
    email: str
    password: str = Field(..., min_length=8)
