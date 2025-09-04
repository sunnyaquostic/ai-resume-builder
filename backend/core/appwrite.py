from fastapi import FastAPI, HTTPException, Depends, Header
from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.services.account import Account
from appwrite.services.databases import Databases

from core.config import settings

def get_server():
    server = Client() 
    server.set_endpoint(settings.APPWRITE_ENDPOINT)
    server.set_project(settings.APPWRITE_PROJECT_ID)
    server.set_key(settings.APPWRITE_API_KEY)
    
    return server

def get_client():
    client = Client() 
    client.set_endpoint(settings.APPWRITE_ENDPOINT)
    client.set_project(settings.APPWRITE_PROJECT_ID)
    client.set_key(settings.APPWRITE_API_KEY)
    
    return client

def get_user_register():
    server = get_server()
    
    return Users(server)

def get_account():
    client = get_client()
    
    return Account(client)

def database():
    db = get_client()
    
    return Databases(db)
 
    
    
   