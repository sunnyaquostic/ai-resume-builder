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
    userId: str
    title: str
    template: str
    basics: ProfileSchema
    education: List[EducationSchema]
    experience: List[Experience]
    projects: List[Project]
    skills: List[Skill]
    certifications: List[Certification]
    
