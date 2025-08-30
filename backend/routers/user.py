from fastapi import APIRouter, Depends, requests, HTTPException, Response 
import uuid
from fastapi.responses import JSONResponse
from schema.userschema import CreateUserSchema, CreateUserResponseSchema, UserLoginResponseSchema, UserLoginSchema
from appwrite.services.account import Account
from core.appwrite import get_account


router = APIRouter(
    prefix='/v1',
    tags=['users']
)


@router.post('/signup', response_model=CreateUserResponseSchema)
def register(user: CreateUserSchema, account: Account = Depends(get_account)):
    name = user.name
    email = user.email
    password = user.password
    confirm_password = user.confirm_password
    
    if password != confirm_password:
        data = {
            'message': 'Password do not match',
            'success': 'false'
        }
        
        return data
    
    hashed_password = password
    
    try: 
        new_user = account.create(
            user_id="unique()",
            email=email,
            password=hashed_password,
            name=name
        )
        
        return {                
                'success': 'true',
                'message': 'You registered successfully',
                'user': new_user
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post('/login', response_model=UserLoginResponseSchema)
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
            secure=True,
            max_age=7200
        )
        userinfo = {
            "userid": user_session['userId'],
            "username": user_session['name'],
            "email": user_session['email'],
        }
        return {"success": True, "userInfo": userinfo}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Credentials")