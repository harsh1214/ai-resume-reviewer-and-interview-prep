import fitz
import pdfplumber
from typing import Dict, Any
import os
from loguru import logger
from docx import Document

class PDFParser:
    @staticmethod
    async def extract_text_pymupdf(file_path: str) -> str:
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
        except Exception as e:
            logger.error(f"PyMuPDF extraction failed: {e}")
            raise

    @staticmethod
    async def extract_text_pdfplumber(file_path: str) -> str:
        try:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text
        except Exception as e:
            logger.error(f"pdfplumber extraction failed: {e}")
            raise

    @staticmethod
    async def extract_text_docx(file_path: str) -> str:
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text
        except Exception as e:
            logger.error(f"DOCX extraction failed: {e}")
            raise

    @staticmethod
    async def extract_text(file_path: str) -> str:
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == ".pdf":
            try:
                return await PDFParser.extract_text_pdfplumber(file_path)
            except Exception:
                return await PDFParser.extract_text_pymupdf(file_path)
        elif ext == ".docx":
            return await PDFParser.extract_text_docx(file_path)
        else:
            raise ValueError(f"Unsupported file type: {ext}")

    @staticmethod
    async def extract_structured_data(file_path: str) -> Dict[str, Any]:
        text = await PDFParser.extract_text(file_path)
        lines = text.split("\n")
        structured = {
            "raw_text": text,
            "lines": lines,
            "character_count": len(text),
            "word_count": len(text.split()),
            "line_count": len(lines),
            "sections": []
        }

        sections = ["education", "experience", "skills", "projects", "certifications", "summary"]
        current_section = None
        section_content = []

        for line in lines:
            line_lower = line.lower().strip()
            if any(line_lower.startswith(section) for section in sections):
                if current_section and section_content:
                    structured["sections"].append({
                        "title": current_section,
                        "content": "\n".join(section_content)
                    })
                current_section = line.strip()
                section_content = []
            elif current_section and line.strip():
                section_content.append(line.strip())
        
        if current_section and section_content:
            structured["sections"].append({
                "title": current_section,
                "content": "\n".join(section_content)
            })
        
        return structured