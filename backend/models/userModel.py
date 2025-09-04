from fastapi import HTTPException
from core.appwrite import database
from appwrite.services.databases import Databases
from typing import Dict
from appwrite.permission import Permission
from appwrite.role import Role

def create_user_collection(db_id: str):
    try:
        db = database()
       
        result = db.create_collection(
            database_id=db_id,
            collection_id="unique()",
            name="users",
            permissions=[],
            document_security=True,     
            enabled=True
        )

        collection_id = result["$id"]

        db.create_string_attribute(db_id, collection_id, "name", 100, required=True)
        db.create_email_attribute(db_id, collection_id, "email", required=True)
        db.create_string_attribute(db_id, collection_id, "password", 255, required=True)
        db.create_string_attribute(db_id, collection_id, "bio", 3000, required=False)
        db.create_string_attribute(db_id, collection_id, "number", 35, required=False)
        db.create_string_attribute(db_id, collection_id, "linkedin", 250, required=False)
        db.create_string_attribute(db_id, collection_id, "github", 250, required=False)
        db.create_string_attribute(db_id, collection_id, "profilePicture", 250, required=False)
        db.create_string_attribute(db_id, collection_id, "role", 50, required=False, default="user")

        education = db.create_collection(db_id, "unique()", "education", permissions=[], document_security=True)
        db.create_string_attribute(db_id, education["$id"], "institution", 225, required=True)
        db.create_string_attribute(db_id, education["$id"], "degree", 100, required=True)
        db.create_string_attribute(db_id, education["$id"], "field_of_study", 150, required=True)
        db.create_datetime_attribute(db_id, education["$id"], "start_date", required=True)
        db.create_datetime_attribute(db_id, education["$id"], "end_date", required=False)
        db.create_relationship_attribute(
            database_id=db_id,
            collection_id=education["$id"],
            related_collection_id=collection_id,
            type="oneToOne",
            two_way=False,
            key="user_id"
        )

        experience = db.create_collection(db_id, "unique()", "experience", permissions=[], document_security=True)
        db.create_string_attribute(db_id, experience["$id"], "company", 150, required=True)
        db.create_string_attribute(db_id, experience["$id"], "role", 100, required=True)
        db.create_string_attribute(db_id, experience["$id"], "description", 1000, required=False)
        db.create_datetime_attribute(db_id, experience["$id"], "start_date", required=True)
        db.create_datetime_attribute(db_id, experience["$id"], "end_date", required=False)
        db.create_relationship_attribute(
            database_id=db_id,
            collection_id=experience["$id"],
            related_collection_id=collection_id,
            type="oneToOne",
            two_way=False,
            key="user_id"
        )

        skills = db.create_collection(db_id, "unique()", "skills", permissions=[], document_security=True)
        db.create_string_attribute(db_id, skills["$id"], "skill_name", 100, required=True)
        db.create_string_attribute(db_id, skills["$id"], "proficiency", 50, required=False)
        db.create_relationship_attribute(
            database_id=db_id,
            collection_id=skills["$id"],
            related_collection_id=collection_id,
            type="oneToOne",
            two_way=False,
            key="user_id"
        )

        projects = db.create_collection(db_id, "unique()", "projects", permissions=[], document_security=True)
        db.create_string_attribute(db_id, projects["$id"], "title", 150, required=True)
        db.create_string_attribute(db_id, projects["$id"], "description", 500, required=False)
        db.create_url_attribute(db_id, projects["$id"], "link", required=False)
        db.create_relationship_attribute(
            database_id=db_id,
            collection_id=projects["$id"],
            related_collection_id=collection_id,
            type="oneToOne",
            two_way=False,
            key="user_id"
        )

        resume = db.create_collection(db_id, "unique()", "resume", permissions=[], document_security=True)
        db.create_string_attribute(db_id, resume["$id"], "title", 150, required=True)
        db.create_string_attribute(db_id, resume["$id"], "template_id", 50, required=True)
        db.create_url_attribute(db_id, resume["$id"], "pdf_url", required=False)
        db.create_relationship_attribute(
            database_id=db_id,
            collection_id=resume["$id"],
            related_collection_id=collection_id,
            type="oneToOne",
            two_way=False,
            key="user_id"
        )


        return {"message": "All collections created successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Setup failed: {str(e)}")


def create_user(userData: Dict, db_id: str, collection_id: str, userId: str):
    try:
        db = database()
        user = db.create_document(
            database_id=db_id,
            collection_id=collection_id,
            document_id="unique()",
            data=userData,
            permissions=[
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
            ]
        )
        return user
    except Exception as e:
        print(str(e) or "Error occurred while creating user")
        return None

def get_user(doc_id: str, db_id: str, collection_id: str):
    try:
        db = database()
        user = db.get_document(
            database_id = db_id,
            collection_id = collection_id,
            document_id = doc_id,
                queries = []
        )
            
        return user
    
    except Exception as e:
        print(str(e) or "Error occurred while fetching user")
        return None

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


def update_users(db_id: str, collection_id: str, doc_id: str, userData: Dict):
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

def delete_users(db_id: str, collection_id: str, doc_id: str):
    try:
        db = database()
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





