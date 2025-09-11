from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from schema.resumeSchema import ResumeInputSchema, ResumeOutputSchema
from core.resume_generator import ResumeGenerator
from models.userModel import get_user_profile
from typing import Dict
from api.auth import authenticate_user
from models.resumeModel import create_resume, get_curricullum_vitae, get_single_curricullum_vitae, delete_cv, create_cv_collection
from core.config import settings 
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from docx import Document
import os, uuid
import io
from fastapi.responses import StreamingResponse

router = APIRouter( 
    prefix='/v1',
    tags=['users']
) 
@router.post('/resume/create', response_model=ResumeOutputSchema)
def generate_resume(data: ResumeInputSchema, current_user: Dict = Depends(authenticate_user)):
    user = get_user_profile(current_user['userId'])
    user_info = user['profile']

    input_data = data.model_dump()
    input_data.update({
        "basics": {
            "name": user_info["name"],
            "email": user_info["email"],
            "phone": user_info["phone"],
            "github": user_info["github"],
        }
    })
    
    if user_info['linkedin']:
        input_data['basics']['linkedin'] = user_info['linkedin']
        
    if user_info['github']:
        input_data['basics']['github'] = user_info['github']

    resume = ResumeGenerator.generate_resume(input_data)
    resume['user_id'] = current_user['userId']
    
    if resume and resume['error'] != '':
        return ResumeOutputSchema(**resume)
    
    # insert into collection_id
    create_resume(resume, settings.APPWRITE_DATABASE_ID, settings.APPWRITE_CV_COLLECTION_ID, current_user['userId'])
    
    return ResumeOutputSchema(**resume)

@router.get('/resumes')
def get_resumes(user: Dict = Depends(authenticate_user)):
    all_resumes = get_curricullum_vitae(user['userId'])
    
    if all_resumes is None:
        return {"success": False, "message": "Could not find resumes"}
    
    if all_resumes['error']:
        return {"success": False, "message": all_resumes['error']}
    
    if len(all_resumes) > 0:
        return {"success": True, "data": all_resumes}

    
@router.get('/resume/get/{id}')
def get_single_resume(id:str, user: Dict = Depends(authenticate_user)) ->dict:
    cv = get_single_curricullum_vitae(user_id=user['user_id'], cv_id=id)
    
    if cv['error'] != '':
        return {"success": False, "message": cv['error']}
    
    if len(cv) == 0:
        return {"success": False, "message": "No record found"}

    return cv 

@router.delete('/resuming/delete/{id}')
def delete_resume(id):
    res = delete_cv(settings.APPWRITE_DATABASE_ID, settings.APPWRITE_CV_COLLECTION_ID, id)
    
    return res

@router.get("/resume/pdf/{resume_id}")
def download_resume_pdf(resume_id: str, user: Dict = Depends(authenticate_user)):
    resume_doc = get_single_curricullum_vitae(user['userId'], resume_id)

    if not resume_doc:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume_text = resume_doc.get("resume", "")

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    text_object = c.beginText(40, height - 50)
    for line in resume_text.split("\n"):
        text_object.textLine(line)
    c.drawText(text_object)
    c.save()

    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=resume.pdf"})



@router.get("/resume/word/{resume_id}")
def download_resume_word(resume_id: str, user: Dict = Depends(authenticate_user)):
    resume_doc = get_single_curricullum_vitae(user['userId'], resume_id)

    if not resume_doc:
        raise HTTPException(status_code=404, detail="Resume not found")

    resume_text = resume_doc.get("resume", "")

    buffer = io.BytesIO()
    doc = Document()
    for line in resume_text.split("\n"):
        if line.strip():
            doc.add_paragraph(line)
    doc.save(buffer)

    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename=resume_{uuid.uuid4().hex}.docx"}
    )

