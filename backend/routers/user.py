from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi.responses import JSONResponse
from api.profile import check_profile_exists
from schema.userschema import CreateUserSchema, UserLoginSchema, AuthResponse, ProfileSchema, ProfileInputSchema, ResetPasswordSchema
from appwrite.services.users import Users
from appwrite.services.account import Account
from core.appwrite import get_account
from models.userModel import create_user, update_users, get_user_profile
from api.auth import authenticate_user
from core.config import settings
from core.appwrite import get_user_register
import jwt
import datetime

router = APIRouter(
    prefix='/v1',
    tags=['users']
) 

def make_response(success: bool, message: str, error: str | None = None, userInfo: dict | None = None):
    return AuthResponse(
        success=success,
        message=message,
        error=error,
        userInfo=userInfo
    )

@router.post('/signup', response_model=AuthResponse)
def register(user_data: CreateUserSchema, account: Account = Depends(get_account)):
    name = user_data.name
    email = user_data.email
    password = user_data.password
    confirm_password = user_data.confirmPassword

    if password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
            
    try: 
        new_user = account.create(
            user_id="unique()",
            email=email,
            password=password,
            name=name,
        )
        
        if new_user:
            verification = account.create_verification(
                url='http://localhost:5173/api/v1/verifyemail'
            )
        return make_response(success=True, message="You registered successfully", error=None, userInfo=dict(new_user))
    except Exception as e:
        return make_response(success=False, message="Registration failed", error=str(e), userInfo=None)

@router.post("/login", response_model=AuthResponse)
def login(
    userData: UserLoginSchema,
    account: Account = Depends(get_account),
    users: Users = Depends(get_user_register),
):
    user_session = account.create_email_password_session(
        email=userData.email,
        password=userData.password
    )

    payload = {
        "user_id": user_session['userId'],
        "email": user_session['providerUid'],
        "secret": user_session['secret'],
        "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=2)
    }
    jwt_token = jwt.encode(payload, settings.SECRET_KEY, settings.ALGORITHM)

    auth_response = make_response(
        success=True,
        message="You logged in successfully",
        error=None,                     
        userInfo={
            "id": user_session['userId'],
            "email": user_session['providerUid'],
            "name": users.get(user_session['userId'])['name']
        }
    )

    response = JSONResponse(content=auth_response.model_dump())
    response.set_cookie(
        key="access_token",
        value=jwt_token,
        httponly=True,
        secure=False, 
        samesite="lax" if not settings.IS_PRODUCTION else "none",
        max_age=60 * 60 * 24,
        path='/'
    )

    return response

@router.post('/profile/create')
def create_profile(data: ProfileInputSchema, current_user = Depends(authenticate_user)):

    try:
        existing = check_profile_exists(current_user['userId'])

        profile_data = data.model_dump()
        profile_data.update({
            "user_id": current_user['userId'],
            "email": current_user.get('email', ''),
            "name": data.name or current_user.get('name', '')
        })
        
        if existing[0] == False:  
            user = create_user(
                profile_data, 
                settings.APPWRITE_DATABASE_ID, 
                settings.APPWRITE_USER_COLLECTION_ID, 
                profile_data['user_id']
            )
            
            res = "Profile created successfully"
        else: 
            user = update_users(
                settings.APPWRITE_DATABASE_ID, 
                settings.APPWRITE_USER_COLLECTION_ID, 
                existing[1],
                data.model_dump(exclude_unset=True), 
            )
            res = "Profile updated successfully"
            
        return ProfileSchema(
            docId=user['$id'],
            user_id=user['user_id'],
            name=user['name'],
            email=user['email'],
            bio=user.get('bio', None),
            phone=user.get('phone', None),
            address=user.get('address', None),
            linkedin=user.get('linkedin', None),
            github=user.get('github', None),
            success=True,
            message=res,
            error=None
        )
    except Exception as e:
        return ProfileSchema(
            docId="",
            userId="",
            name="",
            email="",
            bio=None,
            phone=None,
            address=None,
            linkedin=None,
            github=None,
            success=False,
            message="Profile creation failed",
            error=str(e)
        )


@router.get('/profile/get')
def get_resume(current_user = Depends(authenticate_user)):
    try:
        existing = check_profile_exists(current_user['userId'])

        if existing[0] == False:
            raise HTTPException(status_code=404, detail="Profile not found")

        user = get_user_profile(current_user['userId'])

        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get('/verify')
def verify_email(userId: str, secret: str, account: Account = Depends(get_account)):
    try:
        result = account.update_verification(user_id=userId, secret=secret)
        return {"success": True, "message": "Email verified successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post('/logout', response_model=AuthResponse)
def logout(response: Response, request: Request, account: Account = Depends(get_account)):
    try:
        cookies = request.cookies
        print("Cookies received:", cookies)

        access_token = cookies.get("access_token")
        if not access_token:
            raise HTTPException(status_code=401, detail="No access token found")

        response.delete_cookie(
            key="access_token",
            httponly=True,
            secure=False,
            samesite="lax",
            path='/'
        )

        return make_response(success=True, message="You logged out successfully", error=None, userInfo=None)

    except Exception as e:
        return make_response(success=False, message="Logout failed", error=str(e), userInfo=None)

@router.put('/password/request-reset', response_model=AuthResponse)
def password_reset_link(response: Response, request: Request, data: ResetPasswordSchema, account: Account = Depends(get_account)):

    try:
        result = account.create_recovery(
            email = data.email, 
            url = 'http://localhost:5437/api/v1/password/reset'
        )

        return make_response(success=True, message="Reset link has been sent to your email", error=None, userInfo=result)
        
    except Exception as e:
        return make_response(success=False, message="Error occurred while sending email", error=str(e), userInfo=None)          
        
@router.post('/password/reset', response_model=AuthResponse)
def password_reset_link(response: Response, request: Request, data: ResetPasswordSchema, account: Account = Depends(get_account)):
    try:
        user_id = request.query_params.get('userId')
        secret = request.query_params.get('secret')
        
        if not user_id or not secret:
            make_response(success=False, message='The link is invalid', error='Missing query Parameters', userInfo=None)
        
        if not data.password or not data.confirmPassword:
            make_response(success=False, message="All fields are required", error='All field are required', userInfo=None)
            
        result = account.update_recovery(
            user_id = user_id,
            secret = secret, 
            password = data.password
        )

        make_response(success=True, message="Password reset successfully", error=None, userInfo=result)
    except Exception as e:
        make_response(success=False, message="Password reset Failed", error=str(e),  userInfo=None)

@router.post('/email/verify', response_model=AuthResponse)
def verify_email(req: Request, account: Account = Depends(get_account)):
    try:
        data = {
            "userId": req.query_params.get('userId'),
            "secret": req.query_params.get('secret')
        }
        result = account.verify_email(
            user_id=data['userId'],
            secret=data['secret']
        )
        return make_response(success=True, message="Email verified successfully", error=None, userInfo=result)
    except Exception as e:
        return make_response(success=False, message="Email verification failed", error=str(e), userInfo=None)

