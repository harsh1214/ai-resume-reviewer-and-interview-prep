import uuid
from sqlalchemy import ( Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON )
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    resume_id = Column(String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()), index=True)

    filename = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True)
    file_type = Column(String(50), nullable=True)
    stored_filename = Column(String(255), nullable=True)

    analysis_results = Column(JSON, nullable=True)
    ats_score = Column(Float, nullable=True)
    content_score = Column(Float, nullable=True)
    skills_score = Column(Float, nullable=True)
    formatting_score = Column(Float, nullable=True)

    status = Column(String(50), default="pending")
    error_message = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="resumes")
