from fastapi import APIRouter, Depends, HTTPException
from core.appwrite import get_account
from appwrite.services.account import Account
from api.auth import authenticate_user
from models.adminModel import get_all_users, get_user_profile_by_id, delete_user, update_user, delete_account, get_subscribed_user
from helper.response import make_response
from core.config import settings
from schema.enums import RoleEnum
from datetime import datetime

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
) 

@router.get("/", summary="Admin Home", description="Welcome to the admin home page", )
def read_admin_home(user):
    return {"message": "Welcome to the admin home page"}

@router.get("/users")
def read_users(current_user = Depends(authenticate_user), account: Account = Depends(get_account)):
    if current_user is None or not current_user.get("roles") or "admin" not in current_user.get("roles", []):
        raise HTTPException(status_code=403, detail="Access forbidden: Admins only")
    
    users = get_all_users(settings.APPWRITE_DATABASE_ID, settings.APPWRITE_USER_COLLECTION_ID)
    
    if not users or "documents" not in users:
        return make_response(success=False, message="No users found", error="No user documents", data=None)

    return make_response(success=True, message="Users fetched successfully", data=users["documents"])

@router.get("/users/{user_id}")
def get_single_user(user_id: str):
    if not user_id:
        return make_response(success=False, message="User ID is required", error="Missing user ID", data=None)
    
    user = get_user_profile_by_id(user_id)

    if not user:
        return make_response(success=False, message="User not found", error="No user found", data=None)

    return make_response(success=True, message="User fetched successfully", data=user)

@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    userExists  = get_user_profile_by_id(user_id)
    
    if not userExists:
        return make_response(success=False, message="User not found", error="No user found", data=None)
    
    delete_user(settings.APPWRITE_DATABASE_ID, settings.APPWRITE_USER_COLLECTION_ID, userExists["profile"]["user_id"])
    
    res = delete_account(userExists["profile"]["user_id"])
    
    if not res: 
        return make_response(success=False, message="Failed to delete user account", error="Account deletion failed", data=None)
    
    return {"message": f"User {user_id} deleted"}

@router.put("/users/{user_id}")
def update_user_role(user_id: int, role: RoleEnum) -> dict:
    userExists  = get_user_profile_by_id(user_id)
    if not userExists:
        return make_response(success=False, message="User not found", error="No user found", data=None)
    
    userData = {
        "role": role.value
    }
    
    updated_user_info = update_user(settings.APPWRITE_DATABASE_ID, settings.APPWRITE_USER_COLLECTION_ID, userExists["profile"]["user_id"], userData)
    
    return make_response(success=True, message="User updated successfully", data=updated_user_info)

@router.get("/subscriptions")
def read_subscriptions():
    subscribed_users = get_subscribed_user()
    
    if not subscribed_users or "error" in subscribed_users:
        return make_response(success=True, message="You currently have no subscriber", error=subscribed_users['error'], data=None)
    
    if not subscribed_users or "error" not in subscribed_users:
        return make_response(success=True, message="You currently have no subscriber", error=None, data=None)
        
    return make_response(success=True, message="Subscribed Users", error=None, data=subscribed_users)

@router.delete("/subscriptions/{user_id}")
def cancel_subscription(user_id: str):
    data = {
        "subscription_expiry_date": datetime.date
    }
    cancel_sub = update_user(
        settings.APPWRITE_DATABASE_ID, 
        settings.APPWRITE_USER_COLLECTION_ID, 
        user_id=user_id,
        userData=data
    )
    
    if cancel_sub and "error" in cancel_sub:
        return make_response(success=False, message="Subscription cancellation failed!", error=cancel_sub['error'], data=None)
    
    return make_response(success=True, message='Subscription cancalled successfully!', error=None, data=cancel_sub)

