from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class InterviewStartRequest(BaseModel):
    role: str
    difficulty: str = "medium"
    title: Optional[str] = None

class InterviewSessionResponse(BaseModel):
    id: int
    title: Optional[str]
    role: str
    difficulty: str
    status: str
    average_score: Optional[float] = None
    total_questions: int
    answered_questions: int
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class InterviewMessageRequest(BaseModel):
    content: str

class InterviewMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    score: Optional[float] = None
    feedback: Optional[str] = None
    evaluation_metrics: Optional[Dict[str, Any]] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True

class ChatMessageRequest(BaseModel):
    thread_id: str
    content: str

class ChatMessageResponse(BaseModel):
    role: str
    content: str
    timestamp: datetime