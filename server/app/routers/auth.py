from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta, timezone
from loguru import logger
from app.database import get_db
from app.models.user import User
from app.schemas.user import (ForgotPasswordRequest, ResetPasswordRequest, UserCreate, UserResponse, LoginRequest, TokenResponse, RefreshTokenRequest, ChangePasswordRequest, UserUpdate, VerifyOTPRequest)
from app.utils.security import (generate_otp, get_password_hash, verify_password,  create_access_token, create_refresh_token, decode_token, get_current_user)
from app.utils.email import send_otp_email

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    existing_user = await db.execute(
        select(User).where((User.email == user_data.email) | (User.username == user_data.username))
    )
    if existing_user.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )

    new_user = User(
        email=user_data.email,
        username=user_data.username,
        full_name=user_data.full_name,
        hashed_password=get_password_hash(user_data.password),
        is_active=True,
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    access_token = create_access_token({"sub": str(new_user.id), "email": new_user.email})
    refresh_token = create_refresh_token({"sub": str(new_user.id), "email": new_user.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=TokenResponse)
async def login(login_data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == login_data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is disabled"
        )

    user.last_login = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token({"sub": str(user.id), "email": user.email})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_data: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    try:
        payload = decode_token(refresh_data.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

        user_id = int(payload.get("sub"))
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()

        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )

        access_token = create_access_token({"sub": str(user.id), "email": user.email})
        refresh_token = create_refresh_token({"sub": str(user.id), "email": user.email})

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user
        }

    except Exception as e:
        logger.error(f"Token refresh failed: {e}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_profile(user_data: UserUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    for field, value in user_data.dict(exclude_unset=True).items():
        setattr(current_user, field, value)

    current_user.updated_at = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(current_user)

    return current_user

@router.post("/change-password")
async def change_password(password_data: ChangePasswordRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Current password is incorrect")

    if password_data.current_password == password_data.new_password:
        raise HTTPException(
            status_code=400,
            detail="New password must be different"
        )

    current_user.hashed_password = get_password_hash(password_data.new_password)
    await db.commit()

    return { "status": "success", "message": "Password changed successfully" }

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user:
        return { "status": "sucesss", "message": "If an account exists, an OTP has been sent" }

    otp = generate_otp()

    user.reset_otp = otp
    user.reset_otp_expires = (datetime.now(timezone.utc) + timedelta(minutes=10))

    await db.commit()
    await send_otp_email(user.email, otp)
    return { "status": "success", "message": "If an account exists, an OTP has been sent" }

@router.post("/verify-otp")
async def verify_otp(data: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="If an account exists, an OTP has been sent")

    if user.reset_otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if (not user.reset_otp_expires or user.reset_otp_expires < datetime.now(timezone.utc)):
        raise HTTPException(status_code=400, detail="OTP expired")

    return { "status": "success", "message": "OTP verified" }

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="If an account exists, an OTP has been sent")

    if user.reset_otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if (not user.reset_otp_expires or user.reset_otp_expires < datetime.now(timezone.utc)):
        raise HTTPException(status_code=400, detail="OTP expired")

    user.hashed_password = get_password_hash(data.new_password)

    user.reset_otp = None
    user.reset_otp_expires = None

    await db.commit()

    return { "status": "success", "message": "Password reset successful" }