from typing import List, Optional
from pydantic import BaseSettings 
from pydantic import field_validator
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI_RESUME_BUILDER"
    API_PREFIX: str = "/api"
    DEBUG: bool = True
    DATABASE_URL: str = None
    ALLOWED_ORIGIN: str = ""
    OPENAI_API_KEY: str
    LLM_MODEL: str
    
    def __init__(self, **values):
        super().__init__(**values)
        
        if not self.DEBUG:
            db_user = os.getenv("DB_USER")
            db_password = os.getenv("DB_PASSWORD")
            db_host = os.getenv("DB_HOST")
            db_port = os.getenv("DB_PORT")
            db_name = os.getenv("DB_NAME")
    
            self.DATABASE_URL = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
            
    @field_validator('ALLOWED_ORIGIN')
    def parse_allowed_origin(cls, val) -> List[str]:
        return val.split(",") if val else []
    
    class config:
        env_file = '.env'
        env_file_encoding = 'utf-8'
        case_sensitive = True
        
settings = Settings()
        