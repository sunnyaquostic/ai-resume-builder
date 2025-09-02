from fastapi import APIRouter, Depends, HTTPException, Response, Request
import uuid
from schema.userschema import CreateUserSchema, UserLoginSchema, AuthResponse
from appwrite.services.users import Users
from appwrite.services.account import Account
from core.appwrite import get_user_register, get_account
from core.config import settings


router = APIRouter(
    prefix='/v1',
    tags=['users']
) 

@router.post('/signup', response_model=AuthResponse)
def register(user_data: CreateUserSchema, account: Account = Depends(get_account)):
    name = user_data.name
    email = user_data.email
    password = user_data.password
    confirm_password = user_data.confirm_password

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
            
    try: 
        new_user = account.create(
            user_id="unique()",
            email=email,
            password=password,
            name=name,
        )
        
        return AuthResponse(
            success=True,
            message="You registered successfully",
            userInfo=dict(new_user),
            error=None,
        )
    except Exception as e:
        return AuthResponse(
            success=False,
            message="Registration failed",
            error=str(e),  
            userInfo=None
        )
    
@router.post('/login', response_model=AuthResponse)
def login(userData: UserLoginSchema, response: Response, account: Account = Depends(get_account), users: Users = Depends(get_user_register)):
    try:
        user_session = account.create_email_password_session(
            email=userData.email,
            password=userData.password
        )
        
        jwt = users.create_jwt(
            user_id=user_session['userId']
        )

        response.set_cookie(
            key="access_token",
            value=jwt['jwt'],
            httponly=True,
            secure=False,
            samesite='lax',
            max_age=7200
        )
        
        userinfo = {
            "userid": user_session['userId'],
            "email": user_session['providerUid'],
            "session_id": user_session['secret']
            # "created_at": user_session['createdAt'],
        }
        
        return AuthResponse(
            success=True,
            message="You logged in successfully",
            userInfo=dict(user_session),
            error=None,
        )
        
    except Exception as e:
        return AuthResponse(
            success=False,
            message="Login failed",
            error=str(e),
            userInfo=None
        )

@router.get('/verify')
def verify_email(userId: str, secret: str, account: Account = Depends(get_account)):
    try:
        result = account.update_verification(user_id=userId, secret=secret)
        return {"success": True, "message": "Email verified successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post('/logout', response_model=AuthResponse)
def logout(response: Response, account: Account = Depends(get_account)):
    try:
        account.delete_sessions(
            session_id="current"
        )
        
        # response.delete_cookie(
        #     key="access_token",
        #     httponly=True,
        #     secure=True
        # )

        return {
            "success": True,
            "message": "You logged out successfully",
            "error": None,
            "userInfo": None       
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to Logout")

@router.get("/debug-client")
def debug_client():
    client = get_account()
    return {
        "endpoint": client
    }