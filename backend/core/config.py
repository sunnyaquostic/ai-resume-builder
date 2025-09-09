from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import field_validator
import os

class Settings(BaseSettings):
    APP_NAME: str = "AI Resume Builder"
    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str
    API_PREFIX: str = "/api"
    DEBUG: bool = False
    ALLOWED_ORIGINS: str

    OPENAI_API_KEY: str
    LLM_MODEL: str
    
    APPWRITE_PROJECT_ID: str
    APPWRITE_ENDPOINT: str
    APPWRITE_API_KEY: str
    APPWRITE_DATABASE_ID: str
    APPWRITE_RESUME_COLLECTION_ID:str 
    APPWRITE_EDUCATION_COLLECTION_ID:str
    APPWRITE_PROJECT_COLLECTION_ID:str
    APPWRITE_SKILLS_COLLECTION_ID:str
    APPWRITE_EXPERIENCE_COLLECTION_ID:str
    APPWRITE_USER_COLLECTION_ID:str
    APPWRITE_CV_COLLECTION_ID:str
    
    SECRET_KEY: str 
    ALGORITHM: str

    def __init__(self, **values):
        super().__init__(**values)
        
        if not self.DEBUG:
            db_user = os.getenv("DB_USER")
            db_password = os.getenv("DB_PASSWORD")
            db_host = os.getenv("DB_HOST")
            db_port = os.getenv("DB_PORT")
            db_name = os.getenv("DB_NAME")
    
            self.DATABASE_URL = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
            
    @field_validator('ALLOWED_ORIGINS')
    def parse_allowed_origin(cls, val) -> List[str]:
        return val.split(",") if val else []
    
    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'
        case_sensitive = True
        
settings = Settings()
        