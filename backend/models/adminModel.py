from core.appwrite import database
from core.config import settings
from appwrite.query import Query
from typing import Dict

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

        education = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_EDUCATION_COLLECTION_ID,
            queries=[Query.equal("user_id", user_id)]
        )["documents"]

        experience = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_EXPERIENCE_COLLECTION_ID,
            queries=[Query.equal("user_id", user_id)]
        )["documents"]

        skills = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_SKILLS_COLLECTION_ID,
            queries=[Query.equal("user_id", user_id)]
        )["documents"]

        resume = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_RESUME_COLLECTION_ID,
            queries=[Query.equal("user_id", user_id)]
        )["documents"]

        projects = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_PROJECT_COLLECTION_ID,
            queries=[Query.equal("user_id", user_id)]
        )["documents"]

        return {
            "profile": profile[0] if profile else None,
            "education": education,
            "experience": experience,
            "skills": skills,
            "resume": resume,
            "projects": projects
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

        return user
    
    except Exception as e:
        print(str(e) or "Update profile file")
        return []

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




