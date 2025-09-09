from fastapi import HTTPException
from core.appwrite import database
from appwrite.query import Query
from appwrite.services.databases import Databases
from typing import Dict
from appwrite.permission import Permission
from appwrite.role import Role
from core.config import settings 

def create_cv_collection(db_id: str):
    try:
        db = database()
       
        result = db.create_collection(
            database_id=db_id,
            collection_id="unique()",
            name="curriculum_vitae",
            permissions=[],
            document_security=True,     
            enabled=True
        )

        collection_id = result["$id"]

        db.create_string_attribute(db_id, collection_id, "title", 100, required=True)
        db.create_string_attribute(db_id, collection_id, "name", 250, required=True)
        db.create_email_attribute(db_id, collection_id, "email", required=True)
        db.create_string_attribute(db_id, collection_id, "phone", 25, required=False)
        db.create_string_attribute(db_id, collection_id, "linkedin", 250, required=False)
        db.create_string_attribute(db_id, collection_id, "github", 250, required=False)
        db.create_string_attribute(db_id, collection_id, "professionalsummary", 1000000, required=False)
        db.create_string_attribute(db_id, collection_id, "skills", 100000, required=False)
        db.create_string_attribute(db_id, collection_id, "workexperience", 1000000, required=False)
        db.create_string_attribute(db_id, collection_id, "projects", 1000000, required=False)
        db.create_string_attribute(db_id, collection_id, "education", 1000000, required=False)
        db.create_string_attribute(db_id, collection_id, "certifications", 1000000, required=False)
        db.create_string_attribute(db_id, collection_id, "user_id", 10000, required=False)
        db.create_string_attribute(db_id, collection_id, "error", 5000, required=False)


        return {"message": "Setup completed successfully", "collection_id": collection_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Setup failed: {str(e)}")

def create_resume(inputData: Dict, db_id: str, collection_id: str, userId: str):
    try:
        if not userId:
            raise ValueError("User ID is required to create document")
        
        db = database()
        cv = db.create_document(
            database_id=db_id,
            collection_id=collection_id,
            document_id="unique()",
            data=inputData,
            permissions=[
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        )
        
        return cv
    except Exception as e:
        print("Error occurred while creating user:", str(e))
        return None

def get_curricullum_vitae(user_id: str):
    try:
        db = database()
        cv = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_CV_COLLECTION_ID,
            queries=[Query.equal("user_id", user_id)]
        )["documents"]
        
        return cv
    
    except Exception as e:
        print(str(e) or "Error fetching cv")
        return None

def get_single_curricullum_vitae(user_id: str, cv_id: str):
    try:
        db = database()
        cv = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_CV_COLLECTION_ID,
            queries=[
                Query.equal("user_id", user_id),
                Query.equal("$id", cv_id)
            ]
        )
        
        documents = cv.get("documents", [])
        return documents[0] if documents else None
        
    except Exception as e:
        print(str(e) or "Error fetching cv")
        return None
    
def delete_cv(db_id: str, collection_id: str, doc_id: str):
    try:
        db = database()
        db.delete_document(
            database_id = db_id,
            collection_id = collection_id,
            document_id = doc_id
        )

        return {"message": "User deleted successfully"}
    
    except Exception as e:
        print(str(e) or "Failed to delete cv")
        return []





