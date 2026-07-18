from app.database import Base
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Session info
    title = Column(String(255), nullable=True)
    role = Column(String(100), nullable=False)
    difficulty = Column(String(50), default="medium")  # easy, medium, hard
    status = Column(String(50), default="active")  # active, completed, abandoned

    # Performance metrics
    average_score = Column(Float, nullable=True)
    total_questions = Column(Integer, default=0)
    answered_questions = Column(Integer, default=0)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="interview_sessions")
    messages = relationship("InterviewMessage", back_populates="session", cascade="all, delete-orphan")

class InterviewMessage(Base):
    __tablename__ = "interview_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False)

    # Message content
    role = Column(String(50), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    message_type = Column(String(50))

    # Evaluation (for assistant messages)
    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    evaluation_metrics = Column(JSON, nullable=True)

    # Metadata
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    session = relationship("InterviewSession", back_populates="messages")

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Thread info
    thread_id = Column(String(255), nullable=False, index=True)
    title = Column(String(255), nullable=True)

    # Message content
    role = Column(String(20), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="chat_history")