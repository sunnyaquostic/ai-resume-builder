from fastapi import FastAPI, HTTPException, Depends, Header
from  appwrite.client import Client
from appwrite.client import Client
from appwrite.services.account import Account
from core.config import settings

def get_client():
    client = Client()
    client.set_endpoint(settings.APPWRITE_ENDPOINT)
    client.set_project(settings.APPWRITE_PROJECT_ID)
    client.set_key(settings.APPWRITE_API_KEY)
    
    return client

def get_account():
    client = get_client()
    return Account(client)
 
   