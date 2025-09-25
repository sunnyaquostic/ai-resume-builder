from fastapi import APIRouter, Depends, HTTPException
from core.appwrite import get_account
from appwrite.services.account import Account
from api.auth import authenticate_user
from models.adminModel import get_all_users, get_user_profile_by_id
from core.config import settings

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
) 

def make_response(success: bool, message: str, error: str | None = None, data: dict | None = None):
    return {
        "success": success,
        "message": message,
        "error": error,
        "data": data
    }

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
    
    return {"message": f"User {user_id} deleted"}

@router.put("/users/{user_id}")
def update_user(user_id: int):
    return {"message": f"User {user_id} updated"}

@router.post("/users/")
def create_user():
    return {"message": "User created"}

@router.get("/subscriptions")
def read_subscriptions():
    return {"message": "List of subscriptions"}

@router.get("/subscriptions/{subscription_id}")
def get_current_admin_subscription(subscription_id: int):
    return {"message": f"Details of subscription {subscription_id}"}

@router.delete("/subscriptions/{subscription_id}")
def delete_subscription(subscription_id: int):
    return {"message": f"Subscription {subscription_id} deleted"}

@router.put("/subscriptions/{subscription_id}")
def update_subscription(subscription_id: int):
    return {"message": f"Subscription {subscription_id} updated"}

@router.post("/subscriptions/")
def create_subscription():
    return {"message": "Subscription created"} 

@router.get("/reports")
def read_reports():
    return {"message": "List of reports"}
