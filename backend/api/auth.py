from fastapi import Request, HTTPException
from appwrite.client import Client
from appwrite.services.account import Account
from core.appwrite import get_client, get_account

def authenticate_user(request: Request):
    token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    client = get_client()
    account = get_account()
    
    try:
        client.set_jwt(token)
        user = account.get()
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or Expired Token")
    
    return user