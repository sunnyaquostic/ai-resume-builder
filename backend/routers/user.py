from fastapi import APIRouter, Depends, HTTPException, Response, Request
import uuid
from schema.userschema import CreateUserSchema, UserLoginSchema, AuthResponse
from appwrite.services.users import Users
from appwrite.services.account import Account
from core.appwrite import get_user_register, get_account


router = APIRouter(
    prefix='/v1',
    tags=['users']
) 

@router.post('/signup', response_model=AuthResponse)
def register(user_data: CreateUserSchema, user: Users = Depends(get_user_register)):
    name = user_data.name
    email = user_data.email
    password = user_data.password
    confirm_password = user_data.confirm_password

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
            
    try: 
        new_user = user.create (
            user_id="unique()",
            email=email,
            password=password,
            name=name
        )
        
        return {                
                'success': 'true',
                'message': 'You registered successfully',
                'user': new_user,
                'error': None
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post('/login', response_model=AuthResponse)
def login(userData: UserLoginSchema, response: Response,  account: Account = Depends(get_account)):
    try:
        user_session = account.create_email_password_session(
            email=userData.email,
            password=userData.password
        )
        jwt = account.create_jwt()

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
            "username": user_session['name'],
            "email": user_session['email'],
        }
        
        return {
            "success": True,
            "message": "You logged in successfully",
            "error": None,
            "userInfo": userinfo 
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    
@router.post('/logout', response_model=AuthResponse)
def logout(response: Response, account: Account = Depends(get_account)):
    try:
        account.delete_sessions("current")
        
        response.delete_cookie(
            key="access_token",
            httponly=True,
            secure=True
        )

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