from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from datetime import datetime
from loguru import logger
from app.database import get_db
from app.models.user import User
from app.models.interview import ChatHistory
from app.schemas.interview import ChatMessageRequest, ChatMessageResponse
from app.utils.security import get_current_user
from app.services.chat_service import ChatService

router = APIRouter()
chat_service = ChatService()

@router.post("/", response_model=ChatMessageResponse)
async def chat(request: ChatMessageRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        ai_response = await chat_service.chat(request.thread_id, request.content)

        user_message = ChatHistory(
            user_id=current_user.id,
            thread_id=request.thread_id,
            role="user",
            content=request.content
        )
        db.add(user_message)

        ai_message = ChatHistory(
            user_id=current_user.id,
            thread_id=request.thread_id,
            role="assistant",
            content=ai_response
        )
        db.add(ai_message)

        await db.commit()

        return ChatMessageResponse(
            role="assistant",
            content=ai_response,
            timestamp=datetime.utcnow()
        )

    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat service error: {str(e)}"
        )

@router.get("/history/{thread_id}", response_model=List[ChatMessageResponse])
async def get_chat_history(thread_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db), limit: int = 50):
    result = await db.execute(
        select(ChatHistory)
        .where(ChatHistory.user_id == current_user.id, ChatHistory.thread_id == thread_id)
        .order_by(desc(ChatHistory.created_at))
        .limit(limit)
    )
    messages = result.scalars().all()

    return sorted(messages, key=lambda x: x.created_at)

@router.delete("/history/{thread_id}")
async def clear_chat_history(thread_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            select(ChatHistory).where(
                ChatHistory.user_id == current_user.id,
                ChatHistory.thread_id == thread_id
            )
        )
        messages = result.scalars().all()

        for message in messages:
            await db.delete(message)

        await db.commit()

        await chat_service.clear_conversation(thread_id)

        return {"message": "Chat history cleared successfully"}

    except Exception as e:
        logger.error(f"Failed to clear chat history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear history: {str(e)}"
        )

@router.get("/threads", response_model=List[str])
async def get_user_threads(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ChatHistory.thread_id)
        .where(ChatHistory.user_id == current_user.id)
        .distinct()
        .order_by(desc(ChatHistory.created_at))
    )
    threads = result.scalars().all()
    return list(set(threads))