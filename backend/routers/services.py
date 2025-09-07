from fastapi import APIRouter, Depends
import uuid
from core.config import settings
from schema.resumeSchema import ResumeInputSchema, ProfileSchema
from core.resume_generator import ResumeGenerator
from core.appwrite import get_session
from api.auth import authenticate_user

router = APIRouter(
    prefix='/v1',
    tags=['users']
) 

@router.post('/createresume')
def create_resume(data: ResumeInputSchema):

    user_data = {
        "userId": "12345",
        "title": "Frontend Developer Resume",
        "template": "modern-3",
        "basics": {
            "name": "John Doe",
            "email": "john.doe@gmail.com",
            "phone": "+123456789",
            "linkedin": "https://linkedin.com/in/johndoe",
            "github": "https://github.com/johndoe",
        },
        "rawExperience": "Worked 2 years as frontend developer at TechCorp, built React apps, improved performance, collaborated with backend team.",
        "rawEducation": "Studied Computer Science at ABC University from 2017 to 2021 with 3.7 GPA.",
        "rawSkills": "React, TypeScript, Node.js, Tailwind, SQL, AWS.",
        "rawProjects": "AI Resume Builder project, Next.js + FastAPI + Appwrite, deployed on Vercel.",
    }

    resume = ResumeGenerator.generate_resume(user_data)
    print(resume)

    return {"resume": resume}

@router.get('/resuming/{id}')
def get_single_resume(id):
    pass


@router.put('/resuming/update/{id}')
def update_resume(id):
    pass

@router.delete('/resuming/delete/{id}')
def delete_resume(id):
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


