from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # File information
    filename = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True)
    file_type = Column(String(50), nullable=True)
    version = Column(Integer, default=1)
    stored_filename = Column(String(255), nullable=True)

    # Analysis results
    ats_score = Column(Float, nullable=True)
    content_score = Column(Float, nullable=True)
    skills_score = Column(Float, nullable=True)
    formatting_score = Column(Float, nullable=True)

    # Extracted data (stored as JSON)
    analysis_results = Column(JSON, nullable=True)
    extracted_data = Column(JSON, nullable=True)
    strengths = Column(JSON, nullable=True)  # List of strengths
    weaknesses = Column(JSON, nullable=True)  # List of weaknesses
    suggestions = Column(JSON, nullable=True)  # List of suggestions
    keywords = Column(JSON, nullable=True)  # List of keywords

    # Status
    status = Column(String(50), default="pending")  # pending, analyzing, completed, failed
    error_message = Column(Text, nullable=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="resumes")