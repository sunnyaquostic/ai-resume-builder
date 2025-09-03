from fastapi import APIRouter, Depends, HTTPException, Response, Request
import uuid
from schema.userschema import CreateUserSchema, UserLoginSchema, AuthResponse
from appwrite.services.users import Users
from appwrite.services.account import Account
from core.appwrite import get_user_register, get_account
from core.config import settings


router = APIRouter(
    prefix='/v1',
    tags=['users']
) 

@router.post('/createresuming')
def create_resume(data):
    pass

@router.get('/getresuming')
def get_resume(data):
    pass

@router.get('/resuming/{id}')
def get_single_resume(id):


@router.put('/resuming/update/{id}')
def update_resume(id):
    pass

@router.delete('/resuming/delete/{id}')
def delete_resume(id):
    pass

@router.post('/resumes/{id}/sections')
def create_section(id):
    pass

@router.put('/resumes/{id}/sections/{section_id}')
def create_section(id):
    pass

@router.delete('/resumes/{id}/sections/{section_id}')
def create_section(id):
    pass

@router.post('/resumes/{id}/ai/generate')
def generate_section_ai(id):
    pass

@router.put('/resumes/{id}/ai/improve')
def improve_section_ai(id):
    pass

@router.get('/resumes/{id}/pdf')
def generate_pdf(id):
    pass

@router.get('/resumes/{id}/docx ')
def generate_word(id):
    pass


