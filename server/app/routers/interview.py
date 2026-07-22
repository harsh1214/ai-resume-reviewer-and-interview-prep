from typing import List
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timezone
from loguru import logger
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.interview import InterviewSession, InterviewAnswer
from app.schemas.interview import (InterviewAnswerRequest, InterviewAnswerResponse, InterviewSessionResponse, InterviewSessionResponseWithSWR, InterviewStartRequest, InterviewStartResponse)
from app.utils.security import get_current_user
from app.services.interview_coach import InterviewCoach
from app.models.resume import Resume

router = APIRouter()
coach = InterviewCoach()

@router.post('/start', response_model=InterviewStartResponse)
async def start_interview(request: InterviewStartRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    resume = await db.execute(select(Resume).where(Resume.resume_id == request.resume_id, Resume.user_id == current_user.id))
    resume = resume.scalar_one_or_none()
    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    try:
        questions = await coach.generate_questions(request.role, request.difficulty, resume.analysis_results)
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Question generation failed: {str(e)}")

    session = InterviewSession(
        session_id=str(uuid.uuid4()),
        user_id=current_user.id,
        resume_id=resume.resume_id,
        role=request.role,
        difficulty=request.difficulty,
        questions=questions,
        current_question=0,
        status="active"
    )

    db.add(session)
    await db.commit()
    await db.refresh(session)

    return {
        "session_id": session.session_id,
        "role": session.role,
        "difficulty": session.difficulty,
        "status": session.status,
        "total_questions": len(questions),
        "question": questions[0],
        "current_question": 1,
    }

@router.post("/{session_id}/answer", response_model=InterviewAnswerResponse)
async def send_interview_message(session_id: str, request: InterviewAnswerRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):

    result = await db.execute(select(InterviewSession).where(InterviewSession.session_id == session_id, InterviewSession.user_id == current_user.id))
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")

    if session.status != "active":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Interview already completed",)

    current_question_text = session.questions[session.current_question]

    if request.current_question != session.current_question:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Question index mismatch",)

    if request.question != current_question_text:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Question mismatch",)

    result = await db.execute(select(InterviewAnswer).where(InterviewAnswer.session_id == session.id, InterviewAnswer.question_number == session.current_question + 1))
    existing_answer = result.scalar_one_or_none()

    if existing_answer:
        if existing_answer.status == "completed":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Question already answered",)

        answer_record = existing_answer
        answer_record.answer = request.answer
        answer_record.status = "pending"

    else:
        answer_record = InterviewAnswer(
            session_id=session.id,
            question_number=session.current_question + 1,
            question=current_question_text,
            answer=request.answer,
            status="pending",
        )

        db.add(answer_record)

    await db.commit()
    await db.refresh(answer_record)

    try:
        evaluation = await coach.evaluate_answer(role=session.role, question=current_question_text, answer=request.answer,)

        answer_record.score = evaluation["score"]
        answer_record.feedback = evaluation["feedback"]
        answer_record.evaluation_metrics = evaluation["evaluation_metrics"]
        answer_record.status = "completed"

    except Exception as e:
        answer_record.status = "failed"
        await db.commit()

        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Evaluation failed: {str(e)}")

    next_question = None
    interview_completed = False

    if session.current_question < len(session.questions) - 1:
        session.current_question += 1
        next_question = session.questions[session.current_question]

    else:
        interview_completed = True
        session.completed_at = datetime.now(timezone.utc)
        session.status = "completed"

    answers_result = await db.execute(select(InterviewAnswer).where(InterviewAnswer.session_id == session.id, InterviewAnswer.status == "completed"))
    answers = answers_result.scalars().all()

    scores = [answer.score for answer in answers if answer.score is not None]
    session.average_score = (round(sum(scores) / len(scores), 2) if scores else 0)

    if interview_completed:
        try:
            report = await coach.generate_final_report(role=session.role, answers=answers)
            session.strengths = report.get("strengths", [])
            session.weaknesses = report.get("weaknesses", [])
            session.recommendations = report.get("recommendations", [])

        except Exception:
            logger.error(f"Final report generation failed: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Final report generation failed")

    await db.commit()

    return InterviewAnswerResponse(
        answer_id=answer_record.id,
        score=answer_record.score,
        feedback=answer_record.feedback,
        next_question=next_question,
        interview_completed=interview_completed,
        average_score=session.average_score,
    )

@router.get("/{session_id}", response_model=InterviewSessionResponseWithSWR)
async def get_interview_session(session_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InterviewSession).where(InterviewSession.session_id == session_id, InterviewSession.user_id == current_user.id))
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")

    return session

@router.get("/", response_model=List[InterviewSessionResponse])
async def get_interview_sessions(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InterviewSession).where(InterviewSession.user_id == current_user.id))
    sessions = result.scalars().all()
    if not sessions:
        return []
    return sessions

@router.delete("/{session_id}")
async def delete_interview_session(session_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InterviewSession).where(InterviewSession.session_id == session_id, InterviewSession.user_id == current_user.id))
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview session not found")

    await db.delete(session)
    await db.commit()

    return { "status": "success", "message": "Interview session deleted"}