from fastapi import Depends, HTTPException, status, Cookie
from appwrite.services.account import Account
from appwrite.services.users import Users
from core.appwrite import get_account, get_user_register
from core.config import settings
import jwt
import datetime

def authenticate_user(
    access_token: str = Cookie(None),
    users: Users = Depends(get_user_register)
):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    try:
        jwt_info = jwt.decode(access_token, settings.SECRET_KEY, settings.ALGORITHM) 
 
        if int(datetime.datetime.now().timestamp()) > jwt_info['exp']:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session token expired!")
        
        user = users.get(user_id=jwt_info.get("user_id"))

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        print("Authenticated user:", user['$id'])
        return {
            "userId": user["$id"],
            "name": user.get("name"),
            "email": user.get("email"),
            "secret": user.get("secret")
        }
    
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session token"
        )

