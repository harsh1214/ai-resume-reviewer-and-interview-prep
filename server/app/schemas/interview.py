from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class InterviewStartRequest(BaseModel):
    resume_id: str
    role: str
    difficulty: str = "medium"

class InterviewStartResponse(BaseModel):
    session_id: str
    role: str
    difficulty: str
    status: str
    total_questions: int
    question: str
    current_question: int

class InterviewAnswerRequest(BaseModel):
    current_question: int
    question: str
    answer: str

class InterviewAnswerResponse(BaseModel):
    answer_id: int
    score: float
    feedback: str
    next_question: Optional[str] = None
    interview_completed: bool = False
    average_score: Optional[float] = None

class InterviewSessionResponse(BaseModel):
    session_id: str
    role: str
    difficulty: str
    status: str
    total_questions: int
    current_question: int
    average_score: Optional[float]
    created_at: datetime
    completed_at: Optional[datetime]
    questions: List[str]

    class Config:
        from_attributes = True

class InterviewSessionResponseWithSWR(BaseModel):
    session_id: str
    role: str
    difficulty: str
    status: str
    total_questions: int
    current_question: int
    average_score: Optional[float]
    created_at: datetime
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]
    completed_at: Optional[datetime]
    questions: List[str]

    class Config:
        from_attributes = True

class InterviewReportResponse(BaseModel):
    average_score: float
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]

class EvaluationMetrics(BaseModel):
    technical_accuracy: float
    communication: float
    problem_solving: float
    confidence: float

class AnswerEvaluation(BaseModel):
    score: float
    feedback: str
    evaluation_metrics: EvaluationMetrics

class InterviewFinalReport(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]