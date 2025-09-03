from fastapi import Depends, HTTPException
from appwrite.client import Client
from core.appwrite import get_account,get_database
from appwrite.services.databases import Databases
from typing import Dict

def create_user_collection(db_id: str, db: Databases = Depends(get_database)):
    try:
        result = db.create_collection(
            database_id = db_id,
            collection_id = 'unique()',
            name = 'users',
            # permissions = ["read("any")", "write("any")"],
            document_security = False,
            enabled = True
        )
    
    
        collection_id = result["$id"]

        db.create_string_attribute(db_id, collection_id, "name", 100, required=True)
        db.create_email_attribute(db_id, collection_id, "email", required=True)
        db.create_string_attribute(db_id, collection_id, "password", 255, required=True)
        db.create_string_attribute(db_id, collection_id, "bio", 3000, required=True)
        db.create_string_attribute(db_id, collection_id, "number", 3000, required=True)
        db.create_string_attribute(db_id, collection_id, "linkedin", 3000, required=True)
        db.create_string_attribute(db_id, collection_id, "github", 3000, required=True)
        db.create_string_attribute(db_id, collection_id, "profilePicture", 250, required=True)
        db.create_string_attribute(db_id, collection_id, "role", 50, required=False, default="user")

        education = db.create_collection(db_id, "education", "Education", False, True)
        db.create_string_attribute(db_id, "education", "institution", 225, required=True)
        db.create_string_attribute(db_id, "education", "degree", 100, required=True)
        db.create_string_attribute(db_id, "education", "field_of_study", 150, required=True)
        db.create_datetime_attribute(db_id, "education", "start_date", required=True)
        db.create_datetime_attribute(db_id, "education", "end_date", required=False)
        db.create_relationship_attribute(db_id, "education", "user_id", "users", "oneToOne")

        experience = db.create_collection(db_id, "experience", "Experience", False, True)
        db.create_string_attribute(db_id, "experience", "company", 150, required=True)
        db.create_string_attribute(db_id, "experience", "role", 100, required=True)
        db.create_string_attribute(db_id, "experience", "description", 1000, required=False)
        db.create_datetime_attribute(db_id, "experience", "start_date", required=True)
        db.create_datetime_attribute(db_id, "experience", "end_date", required=False)
        db.create_relationship_attribute(db_id, "experience", "user_id", "users", "oneToOne")

        skills = db.create_collection(db_id, "skills", "Skills", False, True)
        db.create_string_attribute(db_id, "skills", "skill_name", 100, required=True)
        db.create_string_attribute(db_id, "skills", "proficiency", 50, required=False)
        db.create_relationship_attribute(db_id, "skills", "user_id", "users", "oneToOne")

        projects = db.create_collection(db_id, "projects", "Projects", False, True)
        db.create_string_attribute(db_id, "projects", "title", 150, required=True)
        db.create_string_attribute(db_id, "projects", "description", 500, required=False)
        db.create_url_attribute(db_id, "projects", "link", required=False)
        db.create_relationship_attribute(db_id, "projects", "user_id", "users", "oneToOne")

        resume = db.create_collection(db_id, "resume", "Resume", False, True)
        db.create_string_attribute(db_id, "resume", "template_id", 50, required=True)
        db.create_url_attribute(db_id, "resume", "pdf_url", required=False)
        db.create_relationship_attribute(db_id, "resume", "user_id", "users", "oneToOne")

        return {"message": "All collections created successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Setup failed: {str(e)}")

def create_user(userData: Dict, db_id: str, collection_id: str, db: Databases = Depends(get_database)):

    user = db.create_document(
        database_id = db_id,
        collection_id = collection_id,
        document_id = 'unique()',
        data = userData,
        # permissions = ["read("any")"]
    )
    
    return user

def get_user(doc_id: str, db_id: str, collection_id: str, db: Databases = Depends(get_database)):

    user = db.get_document(
    database_id = db_id,
    collection_id = collection_id,
    document_id = doc_id,
        queries = []
    )
        
    return user

def get_all_users(db_id: str, collection_id: str, db: Databases = Depends(get_database)):
    try:   
        users = db.list_documents(
            database_id = db_id,
            collection_id = collection_id,
            queries = []
        )
        
        return users
    
    except Exception as e:
        print(str(e) or "Error occured while fetching users")
        return []


def update_users(db_id: str, collection_id: str, doc_id: str, userData: Dict, db: Databases = Depends(get_database)):
    try:   
        user = db.update_document(
            database_id = db_id,
            collection_id = collection_id,
            document_id = doc_id,
            data = userData,
            # permissions = ["read("any")"]
        )

        return user
    
    except Exception as e:
        print(str(e) or "Update profile file")
        return []

def delete_users(db_id: str, collection_id: str, doc_id: str, db: Databases = Depends(get_database)):
    try:   
        db.delete_document(
            database_id = db_id,
            collection_id = collection_id,
            document_id = doc_id
        )

        return {
            "message": "User deleted successfully"
        }
    
    except Exception as e:
        print(str(e) or "Failed to delete user")
        return []




