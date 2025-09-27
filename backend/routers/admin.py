from fastapi import APIRouter, Depends, HTTPException, Request
from core.appwrite import get_account
from appwrite.services.account import Account
from api.auth import authenticate_user, is_admin
from models.adminModel import get_all_users, get_user_profile_by_id, delete_user, update_user, delete_account, get_subscribed_user
from helper.response import admin_response
from core.config import settings
from schema.enums import RoleEnum
from schema.adminSchema import UpdateUserSchema
from datetime import datetime, timezone

router = APIRouter(
    prefix="/v1/admin",
    tags=["admin"]
) 

@router.get("/", summary="Admin Home", description="Welcome to the admin home page")
def read_admin_home(current_user = Depends(authenticate_user)):
    if not is_admin(current_user["userId"], RoleEnum.ADMIN.value):
        raise HTTPException(status_code=403, detail="Forbidden")
    
    return admin_response(success=True, message="Welcome to the admin home page", error=None, data={"user": current_user})

@router.get("/users")
def read_users(current_user = Depends(authenticate_user), account: Account = Depends(get_account)):
    if not is_admin(current_user["userId"], RoleEnum.ADMIN.value):
        return admin_response(
                success=False, 
                message="Access forbidden", 
                error="You do not have permission to access this resource", 
                data=None
            )
    
    users = get_all_users(settings.APPWRITE_DATABASE_ID, settings.APPWRITE_USER_COLLECTION_ID)

    if not users or "documents" not in users:
        return admin_response(success=False, message="No users found", error="No user documents", data=None)

    return admin_response(success=True, message="Users fetched successfully", data=users["documents"])

@router.get("/users/{user_id}")
def get_single_user(user_id: str, current_user: dict = Depends(authenticate_user)):
    if not is_admin(current_user["userId"], RoleEnum.ADMIN.value):
        raise HTTPException(status_code=403, detail="Forbidden")
    
    if not user_id:
        return admin_response(success=False, message="User ID is required", error="Missing user ID", data=None)
    
    user = get_user_profile_by_id(user_id)

    if not user:
        return admin_response(success=False, message="User not found", error="No user found", data=None)

    return admin_response(success=True, message="User fetched successfully", data=user)

@router.delete("/users/{user_id}")
def delete_user_profile(user_id: str, current_user: dict = Depends(authenticate_user)):
    if not is_admin(current_user["userId"], RoleEnum.ADMIN.value):
        raise HTTPException(status_code=403, detail="Forbidden")
    
    if not user_id:
        return admin_response(success=False, message="User ID is required", error="Missing user ID", data=None)
    
    userExists  = get_user_profile_by_id(user_id)
    
    if not userExists:
        return admin_response(success=False, message="User not found", error="No user found", data=None)
    
    delete_user(settings.APPWRITE_DATABASE_ID, settings.APPWRITE_USER_COLLECTION_ID, userExists["profile"]["user_id"])
    
    res = delete_account(userExists["profile"]["user_id"])
    
    if not res: 
        return admin_response(success=False, message="Failed to delete user account", error="Account deletion failed", data=None)
    
    return {"message": f"User {user_id} deleted"}

@router.put("/users/{user_id}")
def update_user_role(user_id: str, body: UpdateUserSchema, current_user: dict = Depends(authenticate_user)) -> dict:
    if not is_admin(current_user["userId"], RoleEnum.ADMIN.value):
        raise HTTPException(status_code=403, detail="Forbidden")
    
    userExists  = get_user_profile_by_id(user_id)
    if not userExists:
        return admin_response(success=False, message="User not found", error="No user found", data=None)
    
    userData = {
        "roles": body.roles.value if body.roles else userExists["profile"]["roles"],
        "disabled": body.disabled if body.disabled is not None else userExists["profile"]["disabled"]
    }
    
    updated_user_info = update_user(
        settings.APPWRITE_DATABASE_ID, 
        settings.APPWRITE_USER_COLLECTION_ID, 
        userExists["profile"]["$id"],  
        userData
    )
    
    return admin_response(success=True, message="User updated successfully", data=updated_user_info, error=None)

@router.get("/subscriptions")
def read_subscriptions(current_user: dict = Depends(authenticate_user)):
    if not is_admin(current_user["userId"], RoleEnum.ADMIN.value):
        raise HTTPException(status_code=403, detail="Forbidden")

    subscribed_users = get_subscribed_user()

    if not subscribed_users or "error" in subscribed_users:
        return admin_response(success=True, message="You currently have no subscriber", error=subscribed_users['error'], data=None)

    return admin_response(success=True, message="Subscribed Users", error=None, data=subscribed_users)

@router.get("/subscriptions/{user_id}")
def read_subscriptions(user_id: str,current_user: dict = Depends(authenticate_user)):
    if not is_admin(current_user["userId"], RoleEnum.ADMIN.value):
        raise HTTPException(status_code=403, detail="Forbidden")

    subscribed_users = get_subscribed_user(user_id=user_id)

    if not subscribed_users or "error" in subscribed_users:
        return admin_response(success=True, message="You currently have no subscriber", error=subscribed_users['error'], data=None)

    return admin_response(success=True, message="Subscribed Users", error=None, data=subscribed_users)

@router.put("/subscriptions/{user_id}")
def cancel_subscription(user_id: str, current_user: dict = Depends(authenticate_user)):
    if not is_admin(current_user["userId"], RoleEnum.ADMIN.value):
        raise HTTPException(status_code=403, detail="Forbidden")
    
    if not user_id:
        return admin_response(success=False, message="User ID is required", error="Missing user ID", data=None)
    
    user = get_user_profile_by_id(user_id)
    if not user:
        return admin_response(success=False, message="User not found", error="No user found", data=None)
    
    doc_id = user["profile"]["$id"]
    
    if not doc_id:
        return admin_response(success=False, message="User document ID not found", error="No document ID", data=None)
    
    data = {
        "subscription_expiry_date": datetime.now(tz=timezone.utc).isoformat()
    }
    cancel_sub = update_user(
        settings.APPWRITE_DATABASE_ID, 
        settings.APPWRITE_USER_COLLECTION_ID, 
        doc_id=doc_id,
        userData=data
    )
    
    if cancel_sub and "error" in cancel_sub:
        return admin_response(success=False, message="Subscription cancellation failed!", error=cancel_sub['error'], data=None)
    
    return admin_response(success=True, message='Subscription cancalled successfully!', error=None, data=cancel_sub)

