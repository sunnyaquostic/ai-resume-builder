from pydantic import BaseModel, Field, HttpUrl, field_validator, model_validator
from typing import Dict, Optional, Union

class CreateUserSchema(BaseModel):
    email: str
    name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8)
    confirmPassword: str = Field(..., min_length=8)
    # phone_number: str = Field(..., min_length=6, max_length=24)
    
class AuthResponse(BaseModel):
    success: bool
    message: str
    error: Optional[Union[str, Dict]] = None
    userInfo: Optional[Dict] = None

class UserLoginSchema(BaseModel):
    email: str
    password: str = Field(..., min_length=8)
    
class ProfileSchema(BaseModel):
    doc_id: str = Field(..., alias="docId")
    user_id: str = Field(..., alias="userId")
    name: str
    email: str
    role: Optional[str] = "user"
    bio: Optional[str] = None
    phone: Optional[str] = Field(None, min_length=6, max_length=24)
    address: Optional[str] = None
    linkedin: Optional[HttpUrl] = None
    github: Optional[HttpUrl] = None
    success: Optional[bool] = None
    message: Optional[str] = None
    error: Optional[Union[str, Dict]] = None
    
    class Config:
        populate_by_name = True
    
class ProfileInputSchema(BaseModel):
    name: str | None = None
    user_id: str | None = None
    email: str | None = None
    bio: str | None = None
    phone: str | None = Field(None, min_length=6, max_length=24)
    address: str | None = None
    linkedin: str | None = None
    github: str | None = None
    role: str = "user"

class ResetPasswordSchema(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = Field(None, min_length=8, max_length=256)
    confirmPassword: Optional[str] = None

    @model_validator(mode="after")
    def validate_request(self) -> "ResetPasswordSchema":
        if self.email:
            return self

        if not self.password or not self.confirmPassword:
            raise ValueError("Password and confirmPassword are required when email is not provided")

        if self.password != self.confirmPassword:
            raise ValueError("Passwords do not match")

        return self