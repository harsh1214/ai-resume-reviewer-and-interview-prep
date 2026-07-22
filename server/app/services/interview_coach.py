from typing import Any, Dict, List 
from loguru import logger
from google.genai import types
from google import genai
from app.config import settings
from app.schemas.interview import AnswerEvaluation, InterviewFinalReport

class InterviewCoach:
    def __init__(self):
        self.api_key = settings.GOOGLE_API_KEY

        if not self.api_key:
            logger.warning("GOOGLE_API_KEY not set. Interview coach will not work.")
            return

        self.client = genai.Client(api_key=self.api_key)

    async def generate_questions(self, role: str, difficulty: str = "medium", resume: str = "") -> List[str]:
        try:
            if not role or not difficulty:
                raise ValueError("Missing required parameters")

            prompt = f"""
                You are an expert technical interviewer.
                Role: {role}
                Difficulty: {difficulty}
                Resume Analysis: {resume}

                Generate exactly 5 interview questions.
                Rules:
                - No duplicate questions
                - Mix technical and behavioral questions
                - Use resume skills and experience
                - Return ONLY valid JSON array

                Example:

                [
                    "Question 1",
                    "Question 2",
                    "Question 3",
                    "Question 4",
                    "Question 5"
                ]
            """
            response = self.client.models.generate_content(
                model=settings.AI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=list[str]
                )
            )

            questions = response.parsed

            if not questions:
                raise ValueError("Gemini returned no questions")
            
            if len(questions) != 5:
                raise ValueError(f"Expected 5 questions but got {len(questions)}")

            print("QUESTIONS TYPE:", type(questions))
            print("QUESTIONS:", questions)
            return questions

        except Exception as e:
            logger.error(f"Error generating questions: {e}")
            raise ValueError("Failed to generate interview questions")  

    async def evaluate_answer(self, question: str, answer: str, role: str) -> Dict[str, Any]:
        try:
            if not question or not answer or not role:
                return { "status": "error", "message": "Missing required parameters"}
            
            prompt=f"""
                You are a senior technical interviewer.
                Role: {role}
                Question:
                {question}
                Candidate Answer:
                {answer}

                Evaluate:
                1. Technical Accuracy (0-100)
                2. Communication (0-100)
                3. Problem Solving (0-100)
                4. Confidence (0-100)

                Also provide constructive feedback.
            """

            response = self.client.models.generate_content(
                model=settings.AI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=AnswerEvaluation,
                    temperature=0.2
                )
            )

            evaluation = response.parsed

            if not evaluation:
                raise ValueError("Gemini returned no evaluation")
            
            return evaluation.model_dump()

        except Exception as e:
            logger.error(f"Error evaluating answer: {e}")
            raise ValueError("Failed to evaluate answer")

    async def generate_final_report(self, role: str, answers: Dict[str, Any]) -> str:
        try:
            if not role or not answers:
                raise ValueError("Missing required parameters")

            formatted_answers = []
            for answer in answers:
                formatted_answers.append({
                    "question": answer.question,
                    "answer": answer.answer,
                    "score": answer.score,
                    "feedback": answer.feedback
                })

            prompt = f"""
                You are a senior technical interviewer.
                Role: {role}
                Candidate Answers:
                {formatted_answers}

                Analyze the overall interview performance
                Return:
                - 3 strengths
                - 3 weaknesses
                - 3 recommendations for improvement
                Be specific and actionable.
            """

            response = self.client.models.generate_content(
                model=settings.AI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=InterviewFinalReport,
                    temperature=0.3,
                )
            )

            report = response.parsed

            if not report:
                raise ValueError("Gemini returned no report")

            return report.model_dump()

        except Exception as e:
            logger.error(f"Error generating final report: {e}")
            raise ValueError("Failed to generate final report")