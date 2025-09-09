from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime

class ProfileSchema(BaseModel):
    userId: str
    name: str
    email: str
    bio: Optional[str] = None
    phone: Optional[str] = Field(None, min_length=6, max_length=24)
    address: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    
class ResumeSchema(BaseModel):
    resumeId: str
    UserId: str
    title: str
    template: str
    createdAt: Optional[datetime]
    updatedAt: Optional[datetime]

class SectionSchema(BaseModel):
    sectionId: str
    resumeId: str
    type: str = Field(..., pattern="^(education|experience|skills|projects|certifications|summary)$")
    order: int

class EducationSchema(BaseModel):
    sectionId: str
    school: str
    degree: str
    fieldOfStudy: str
    startDate: date
    endDate: Optional[date]
    grade: Optional[str]
    description: Optional[str]

class Experience(BaseModel):
    sectionId: str
    company: str
    role: str
    startDate: date
    endDate: Optional[datetime]
    responsibilities: List[str]

class Project(BaseModel):
    sectionId: str
    name: str
    description: str
    technologies: List[str]
    link: Optional[str]

class Skill(BaseModel):
    sectionId: str
    name: str
    level: str = Field(..., pattern="^(Beginner|Intermediate|Advanced|Expert)$")

class Certification(BaseModel):
    sectionId: str
    title: str
    issuer: str
    date: date
    credentialId: Optional[str]
    link: Optional[str]
    
class ResumeInputSchema(BaseModel):
    title: str
    template: str = Field(..., pattern="^(modern-1|modern-2|modern-3)$")
    education: str
    experience: str
    projects: str
    skills: str
    certifications: Optional[str]
    
class ResumeOutputSchema(BaseModel):
    title: Optional[str] = ''
    name: Optional[str] = ''
    email: Optional[str] = ''
    phone: Optional[str] = ''
    linkedin: Optional[str] = ''
    github: Optional[str] = ''
    professionalsummary: Optional[str] = ''
    skills: Optional[str] = ''
    workexperience: Optional[str] = ''
    projects: Optional[str] = ''
    education: Optional[str] = ''
    certifications: Optional[str|None] = None
    error: Optional[str] = ''
    user_id: str

    
