from typing import Dict, Any
from fastapi import types
from google import genai
from loguru import logger
from app.config import settings
from app.services.pdf_parser import PDFParser
from app.schemas.resume import ResumeAIAnalysis


class ResumeAnalyzer:
    def __init__(self):
        self.api_key = settings.GOOGLE_API_KEY
        if not self.api_key:
            logger.warning("GOOGLE_API_KEY not set. AI analysis will not work.")
            return

        self.client = genai.Client(api_key=self.api_key)

    async def analyze_resume(self, file_path: str) -> Dict[str, Any]:
        try:
            resume_text = await PDFParser.extract_text(file_path)
            if not resume_text or len(resume_text) < 100:
                return {
                    "error": "Could not extract enough text from the resume",
                    "ats_score": 0,
                    "strengths": [],
                    "weaknesses": [],
                    "suggestions": [],
                    "keywords": [],
                }

            analysis = await self._analyze_with_ai(resume_text)
            return analysis
        except Exception as e:
            logger.error(f"Resume analysis failed: {e}")
            raise

    async def _analyze_with_ai(self, resume_text: str) -> ResumeAIAnalysis:

        prompt = f"""
            You are an expert resume reviewer with 20 years of HR experience at top tech companies.
            Analyze the following resume and provide a detailed evaluation.
            IMPORTANT: Return ONLY valid JSON. No markdown formatting, no explanation, just the JSON object.
            Resume Text:
            {resume_text}
        
            Return a JSON object with the following structure:
            {{
                "personal_info": {{
                    "name": "extracted name or null",
                    "email": "extracted email or null",
                    "phone": "extracted phone or null",
                    "location": "extracted location or null",
                    "linkedin": "extracted linkedin URL or null"
                }},
                "summary": "professional summary (1-2 sentences)",
                "skills": {{
                    "technical": ["skill1", "skill2", ...],
                    "soft": ["skill1", "skill2", ...]
                }},
                "work_experience": [
                    {{
                        "company": "company name",
                        "title": "job title",
                        "duration": "duration",
                        "achievements": ["achievement1", "achievement2", ...]
                    }}
                ],
                "education": [
                    {{
                        "institution": "institution name",
                        "degree": "degree obtained",
                        "year": "year"
                    }}
                ],
                "certifications": ["cert1", "cert2", ...],
                "ats_score": {{
                    "overall": 0-100,
                    "content": 0-100,
                    "skills": 0-100,
                    "formatting": 0-100,
                    "keyword_density": 0-100
                }},
                "strengths": ["strength1", "strength2", "strength3"],
                "weaknesses": ["weakness1", "weakness2", "weakness3"],
                "suggestions": [
                    "specific actionable suggestion 1",
                    "specific actionable suggestion 2",
                    "specific actionable suggestion 3"
                ],
                "keywords": ["keyword1", "keyword2", "keyword3"]
            }}
        
            Analyze thoroughly. For ATS scoring, consider:
            - Content quality (40%): relevance, clarity, impact
            - Skills matching (30%): keywords, technical skills, soft skills
            - Formatting (30%): structure, readability, consistency
        
            Return only valid JSON.
            """

        response = self.client.models.generate_content(
            model=settings.AI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=settings.AI_TEMPERATURE,
                max_output_tokens=settings.AI_MAX_TOKENS,
                response_mime_type="application/json",
            ),
        )

        try:
            analysis = ResumeAIAnalysis.model_validate_json(response.text)

            return analysis
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            raise

    async def calculate_ats_score(self, analysis: ResumeAIAnalysis) -> float:
        return round(analysis.ats_score.overall, 2)
