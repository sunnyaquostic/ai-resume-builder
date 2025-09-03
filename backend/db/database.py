from fastapi import Depends
from core.appwrite import get_database
from appwrite.services.databases import Databases

def create_database(db: Databases = Depends(get_database)):
    try: 
        result = db.create(
            database_id = 'unique()',
            name = 'ai-builder',
            enabled = False
        )
        
        return result
    except Exception as e:
        print(f"Error creating database: {str(e)}")
        return {"error": str(e)}

def get_databases(database_id: str, db: Databases = Depends(get_database)):
    try:
        return db.list()
    except Exception as e:
        print(f"Error fetching databases: {str(e)}")
        return {"error": str(e)}
