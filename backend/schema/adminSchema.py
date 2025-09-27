from typing import Optional
from pydantic import BaseModel
from schema.enums import RoleEnum 

class UpdateUserSchema(BaseModel):
    roles: Optional[RoleEnum] = RoleEnum.USER
    disabled: Optional[bool] = None
