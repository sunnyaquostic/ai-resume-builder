from fastapi import Depends
from core.appwrite import database
from appwrite.services.databases import Databases

def create_database():
    try: 
        db = database()
        result = db.create(
            database_id = 'unique()',
            name = 'ai-builder',
            enabled = True
        )
        print(f"Database created successfully: {result}")
        return result
    except Exception as e:
        print(f"Error creating database: {str(e)}")
        return {"error": str(e)}

def get_databases():
    try:
        db = database()
        return db.list()
    except Exception as e:
        print(f"Error fetching databases: {str(e)}")
        return {"error": str(e)}
