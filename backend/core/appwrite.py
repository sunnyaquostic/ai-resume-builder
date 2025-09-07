from fastapi import FastAPI, HTTPException
from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.services.account import Account
from appwrite.services.databases import Databases
from core.config import settings

def Root():
    client = Client() 
    client.set_endpoint(settings.APPWRITE_ENDPOINT)
    client.set_project(settings.APPWRITE_PROJECT_ID)
    
    return client 
def get_server():
    server = Root()
    server.set_key(settings.APPWRITE_API_KEY)
    
    return server

def get_client():
    client = Root()
    client.set_key(settings.APPWRITE_API_KEY)
    
    return client
def get_session(session_id: str):
    user_session = Root()
    user_session.set_key(session_id)
    
    return Databases(user_session)

def get_user_register() -> Users:
    server = get_server()
    
    return Users(server)

def get_account():
    client = get_client()
    
    return Account(client)

def database():
    db = get_client()
    
    return Databases(db)
 
    
    
   