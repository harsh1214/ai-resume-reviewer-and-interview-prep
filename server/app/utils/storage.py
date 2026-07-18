import os
from app.config import settings
import cloudinary
from loguru import logger
from pathlib import Path
import uuid
from datetime import datetime
import aiofiles
from typing import Optional


def setup_storage():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    if all([settings.CLOUDINARY_API_KEY, settings.CLOUDINARY_API_SECRET, settings.CLOUDINARY_CLOUD_NAME]):
        try:
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
                secure=True,
            )
            logger.info("Cloudinary setup successful")
        except Exception as e:
            logger.error(f"Cloudinary setup failed: {e}")

    else:
        logger.info("Cloudinary not configured")

def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower()

def is_allowed_file(filename: str) -> bool:
    ext = get_file_extension(filename)
    return ext in [ext.strip() for ext in settings.ALLOWED_EXTENSIONS.split(",")]

def generate_unique_filename(original_filename: str) -> str:
    ext = get_file_extension(original_filename)
    unique_id = uuid.uuid4().hex[:12]
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"resume_{unique_id}_{timestamp}{ext}"

async def save_file_locally(file_content: bytes, filename: str) -> str:
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(file_content)
    return file_path

async def upload_to_cloudinary(file_path: str, public_id: Optional[str] = None) -> str:
    try:
        if not public_id:
            public_id = f"resumes/{Path(file_path).stem}"

        result = cloudinary.uploader.upload(file_path, public_id=public_id, resource_type="auto", folder="ai_resume_reviewer")

        return result.get("secure_url", result.get("url"))
    except Exception as e:
        logger.error(f"Cloudinary upload failed: {e}")
        raise

async def delete_from_cloudinary(public_id: str):
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result.get("result") == "ok"
    except Exception as e:
        logger.error(f"Cloudinary delete failed: {e}")
        return False

async def get_file_url(file_path: str, use_cloudinary: bool = True) -> str:
    if use_cloudinary and all([settings.CLOUDINARY_CLOUD_NAME, settings.CLOUDINARY_API_KEY, settings.CLOUDINARY_API_SECRET]):
        try:
            url = await upload_to_cloudinary(file_path)
            return url
        except Exception:
            # Fallback to local URL
            return f"/uploads/{Path(file_path).name}"
    else:
        return f"/uploads/{Path(file_path).name}"