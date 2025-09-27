from fastapi import Depends
from core.appwrite import database, get_account
from core.config import settings
from appwrite.query import Query
from typing import Dict
from appwrite.services.account import Account
from datetime import datetime, timezone


def get_all_users(db_id: str, collection_id: str):
    try:
        db = database() 
        users = db.list_documents(
            database_id = db_id,
            collection_id = collection_id,
            queries = []
        )
        
        return users
    
    except Exception as e:
        print(str(e) or "Error occured while fetching users")
        return []

def get_user_profile_by_id(user_id: str):
    try:
        db = database()
        profile = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_USER_COLLECTION_ID,
            queries=[Query.equal("user_id", user_id)]
        )["documents"]

        return {
            "profile": profile[0] if profile else None,
        }
            
    except Exception as e:
        print(str(e) or "Error occurred while fetching user")
        return None

def update_user(db_id: str, collection_id: str, doc_id: str, userData: Dict):
    try:
        db = database()
        user = db.update_document(
            database_id = db_id,
            collection_id = collection_id,
            document_id = doc_id,
            data = userData,
        )
        print(f"User updated: {user}")
        return user
    
    except Exception as e:
        print(str(e) or "Update profile file")
        return {"error": f"Error updating user information: {str(e)}"}

def delete_user(db_id: str, collection_id: str, doc_id: str):
    try:
        db = database()
        response = db.delete_document(
            database_id = db_id,
            collection_id = collection_id,
            document_id = doc_id
        )

        return response 
    except Exception as e:  
        print(str(e) or "Error occured while deleting user")
        return {"error": str(e) or "Error occured while deleting user"}

def delete_account(user_id: str, account: Account = Depends(get_account)) -> bool:
    try:
        account.delete_identity(user_id=user_id)
        return True
    except Exception as e:  
        print(str(e) or "Error occured while deleting user account")
        return False
        
def get_subscribed_user(user_id: str = None):
    try:
        current_date = datetime.now(tz=timezone.utc).isoformat()
        db = database()
        
        if not user_id:
            subscriber = db.list_documents(
                database_id=settings.APPWRITE_DATABASE_ID,
                collection_id=settings.APPWRITE_USER_COLLECTION_ID,
                queries=[Query.greater_than_equal("subscription_expiry_date", current_date)]
            )
        else:
            subscriber = db.list_documents(
                database_id=settings.APPWRITE_DATABASE_ID,
                collection_id=settings.APPWRITE_USER_COLLECTION_ID,
                queries=[
                    Query.equal("user_id", user_id),
                    Query.greater_than_equal("subscription_expiry_date", current_date)
                ]
            )

        return subscriber
            
    except Exception as e:
        print(str(e) or "Error fetching subscribed users")
        return {"error": str(e) or "Error fetching subscriber user"}
    



