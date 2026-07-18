from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
import os
from loguru import logger
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import (ResumeAnalysisResponse, ResumeListResponse)
from app.utils.security import get_current_user
from app.utils.storage import (save_file_locally, get_file_url, generate_unique_filename, is_allowed_file, get_file_extension)
from app.services.resume_analyzer import ResumeAnalyzer
from app.config import settings

router = APIRouter()
analyzer = ResumeAnalyzer()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file uploaded")

    if not is_allowed_file(file.filename):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"File type not allowed. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS.split(','))}")

    content = await file.read()
    if len(content) > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE // 1024 // 1024}MB")

    unique_filename = generate_unique_filename(file.filename)
    file_path = await save_file_locally(content, unique_filename)

    file_url = await get_file_url(file_path)

    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        stored_filename=unique_filename,
        file_url=file_url,
        file_size=len(content),
        file_type=get_file_extension(file.filename),
        status="pending"
    )

    db.add(resume)
    await db.commit()
    await db.refresh(resume)

    return {
        "id": resume.id,
        "message": "Resume uploaded successfully",
        "status": "pending"
    }

@router.post("/analyze/{resume_id}")
async def analyze_resume(resume_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resume).where(Resume.id == resume_id,Resume.user_id == current_user.id))
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    if resume.status == "completed":
        return resume

    file_path = os.path.join(settings.UPLOAD_DIR, resume.stored_filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume file not found")

    try:
        resume.status = "analyzing"
        await db.commit()

        analysis = await analyzer.analyze_resume(file_path)

        resume.analysis_results = analysis
        resume.ats_score = analysis.get("ats_score", {}).get("overall", 0)
        resume.content_score = analysis.get("ats_score", {}).get("content", 0)
        resume.skills_score = analysis.get("ats_score", {}).get("skills", 0)
        resume.formatting_score = analysis.get("ats_score", {}).get("formatting", 0)
        resume.status = "completed"

        await db.commit()
        await db.refresh(resume)

        return {
            "status": "success",
            "resume_id": resume.id,
        }

    except Exception as e:
        logger.error(f"Resume analysis failed: {e}")
        resume.status = "failed"
        resume.error_message = str(e)
        await db.commit()

        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Analysis failed: {str(e)}")

@router.get("/", response_model=List[ResumeListResponse])
async def get_resumes(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db), skip: int = 0, limit: int = 20):
    result = await db.execute(select(Resume).where(Resume.user_id == current_user.id).order_by(desc(Resume.created_at)).offset(skip).limit(limit))
    return result.scalars().all()

@router.get("/{resume_id}", response_model=ResumeAnalysisResponse)
async def get_resume(resume_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id))
    resume = result.scalar_one_or_none()

    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    return resume

@router.delete("/{resume_id}")
async def delete_resume(resume_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id))
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    file_path = os.path.join(settings.UPLOAD_DIR, resume.stored_filename)
    if os.path.exists(file_path):
        os.remove(file_path)

    await db.delete(resume)
    await db.commit()

    return { "status": "success", "message": "Resume deleted successfully" }