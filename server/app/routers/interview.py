from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.interview import InterviewSession, InterviewMessage
from app.schemas.interview import (InterviewStartRequest, InterviewSessionResponse, InterviewMessageRequest, InterviewMessageResponse)
from app.utils.security import get_current_user
from app.services.interview_coach import InterviewCoach

router = APIRouter()
coach = InterviewCoach()

@router.post("/start", response_model=InterviewSessionResponse)
async def start_interview(request: InterviewStartRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    question = await coach.generate_question(request.role, request.difficulty)

    session = InterviewSession(
        user_id=current_user.id,
        title=request.title or f"{request.role} Interview",
        role=request.role,
        difficulty=request.difficulty,
        status="active"
    )

    db.add(session)
    await db.commit()
    await db.refresh(session)

    ai_message = InterviewMessage(
        session_id=session.id,
        role="assistant",
        content=question
    )

    db.add(ai_message)
    await db.commit()
    await db.refresh(ai_message)
    return session

@router.post("/{session_id}/message", response_model=InterviewMessageResponse)
async def send_interview_message(session_id: int, request: InterviewMessageRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(InterviewSession).where(
            InterviewSession.id == session_id,
            InterviewSession.user_id == current_user.id,
            InterviewSession.status == "active"
        )
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active session not found"
        )

    user_message = InterviewMessage(
        session_id=session.id,
        role="user",
        content=request.content
    )
    db.add(user_message)

    messages_result = await db.execute(
        select(InterviewMessage)
        .where(InterviewMessage.session_id == session.id)
        .order_by(InterviewMessage.timestamp.desc())
        .limit(10)
    )
    previous_messages = messages_result.scalars().all()

    if len(previous_messages) > 0:
        last_question = next((m for m in previous_messages if m.role == "assistant"), None)
        if last_question:
            evaluation = await coach.evaluate_answer(
                last_question.content,
                request.content,
                session.role
            )

            session.total_questions += 1
            session.answered_questions += 1

            if session.average_score is None:
                session.average_score = evaluation.get("score", 0)
            else:
                session.average_score = (session.average_score + evaluation.get("score", 0)) / 2

    previous_scores = []
    next_difficulty = await coach.get_next_question_strategy(previous_scores)
    next_question = await coach.generate_question(session.role, next_difficulty)

    ai_message = InterviewMessage(
        session_id=session.id,
        role="assistant",
        content=next_question
    )
    db.add(ai_message)

    session.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(ai_message)

    return ai_message

@router.post("/{session_id}/end", response_model=InterviewSessionResponse)
async def end_interview(session_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(InterviewSession).where(
            InterviewSession.id == session_id,
            InterviewSession.user_id == current_user.id,
            InterviewSession.status == "active"
        )
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Active session not found"
        )

    session.status = "completed"
    session.completed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(session)

    return session

@router.get("/", response_model=List[InterviewSessionResponse])
async def get_interview_sessions(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db), skip: int = 0, limit: int = 20):
    result = await db.execute(
        select(InterviewSession)
        .where(InterviewSession.user_id == current_user.id)
        .order_by(desc(InterviewSession.created_at))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

@router.get("/{session_id}/messages", response_model=List[InterviewMessageResponse])
async def get_session_messages(session_id: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(InterviewSession).where(
            InterviewSession.id == session_id,
            InterviewSession.user_id == current_user.id
        )
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    messages_result = await db.execute(
        select(InterviewMessage)
        .where(InterviewMessage.session_id == session_id)
        .order_by(InterviewMessage.timestamp)
    )
    return messages_result.scalars().all()