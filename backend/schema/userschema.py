from pydantic import BaseModel, Field
from typing import Dict, Optional, Union

class CreateUserSchema(BaseModel):
    email: str
    name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)
    # phone_number: str = Field(..., min_length=6, max_length=24)
    
class AuthResponse(BaseModel):
    success: bool
    message: str
    error: Optional[Union[str, Dict]] = None
    userInfo: Optional[Dict] = None

class UserLoginSchema(BaseModel):
    email: str
    password: str = Field(..., min_length=8)
