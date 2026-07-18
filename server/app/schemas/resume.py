from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ResumeUploadRequest(BaseModel):
    filename: str
    file_size: Optional[int] = None
    file_type: Optional[str] = None

class ResumeAnalysisResponse(BaseModel):
    id: int
    filename: str
    file_url: str
    ats_score: Optional[float] = None
    content_score: Optional[float] = None
    skills_score: Optional[float] = None
    formatting_score: Optional[float] = None
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None
    suggestions: Optional[List[str]] = None
    keywords: Optional[List[str]] = None
    extracted_data: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class ResumeListResponse(BaseModel):
    id: int
    filename: str
    ats_score: Optional[float] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ResumeAnalysisRequest(BaseModel):
    resume_id: int

class ATSFeedbackResponse(BaseModel):
    score: float
    feedback: Dict[str, Any]
    suggestions: List[str]
    keywords: List[str]

class PersonalInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None


class Skills(BaseModel):
    technical: List[str] = Field(default_factory=list)
    soft: List[str] = Field(default_factory=list)


class WorkExperience(BaseModel):
    company: str
    title: str
    duration: str
    achievements: List[str] = Field(default_factory=list)


class Education(BaseModel):
    institution: str
    degree: str
    year: str


class ATSScore(BaseModel):
    overall: float = 0
    content: float = 0
    skills: float = 0
    formatting: float = 0
    keyword_density: float = 0


class ResumeAIAnalysis(BaseModel):
    personal_info: PersonalInfo
    summary: str = ""
    skills: Skills
    work_experience: List[WorkExperience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    ats_score: ATSScore
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)