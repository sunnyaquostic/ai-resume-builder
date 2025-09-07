from appwrite.query import Query
from pyparsing import Optional
from core.appwrite import database
from core.config import settings 

def check_profile_exists(user_id: str) -> tuple[bool, str|None]:
     try:   
        user_id = user_id.strip()
        
        db = database()
        existing = db.list_documents(
            database_id=settings.APPWRITE_DATABASE_ID,
            collection_id=settings.APPWRITE_USER_COLLECTION_ID,
            queries=[Query.equal("user_id", user_id)]
        )

        if existing["total"] > 0:
            doc_id = existing["documents"][0]["$id"]
            return True, doc_id

        return False, None
     except Exception as e:
        print("Error checking profile existence:", str(e))
        return False, None  