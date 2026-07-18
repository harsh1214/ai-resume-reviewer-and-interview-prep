from google import genai
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from loguru import logger
from sqlalchemy import text
from app.config import settings
from app.database import engine, Base, get_db
import app.models
from app.routers import auth, resume

# from app.routers import auth, resume, interview, chat
from app.utils.storage import setup_storage


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting AI Resume Reviewer API...")

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    setup_storage()

    logger.info(f"API is running at http://localhost:8000")
    yield

    logger.info("Shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume Analysis"])
# app.include_router(interview.router, prefix="/api/interview", tags=["Interview"])
# app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])

@app.get("/")
async def root():
    return {
        "message": "AI Resume Reviewer API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/schema")
async def schema(db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT current_schema()"))
    return {"schema": result.scalar()}