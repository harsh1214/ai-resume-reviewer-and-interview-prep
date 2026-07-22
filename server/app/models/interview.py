from sqlalchemy import ( Column, Integer, String, Float, DateTime, ForeignKey, JSON, Text )
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(36), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(String(36), ForeignKey("resumes.resume_id", ondelete="CASCADE"), nullable=False)
    role = Column(String(100), nullable=False)
    difficulty = Column(String(20), default="medium")
    status = Column(String(20), default="active")
    total_questions = Column(Integer, default=5)
    current_question = Column(Integer, default=0)
    average_score = Column(Float, nullable=True)
    questions = Column(JSON, nullable=False)
    strengths = Column(JSON, nullable=True)
    weaknesses = Column(JSON, nullable=True)
    recommendations = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")
    answers = relationship("InterviewAnswer", back_populates="session", cascade="all, delete-orphan")

class InterviewAnswer(Base):
    __tablename__ = "interview_answers"

    id = Column(Integer, primary_key=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False)
    question_number = Column(Integer)
    question = Column(Text)
    answer = Column(Text)
    score = Column(Float)
    feedback = Column(Text)
    evaluation_metrics = Column(JSON)
    status= Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("InterviewSession", back_populates="answers")