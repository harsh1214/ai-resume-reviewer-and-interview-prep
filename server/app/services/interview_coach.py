# from typing import Dict, Any, List, Optional
# from loguru import logger
# import google.generativeai as genai
# from langchain_core.prompts import PromptTemplate
# from langchain_google_genai import ChatGoogleGenerativeAI
# from app.config import settings

# class InterviewCoach:
#     def __init__(self):
#         """Initialize the interview coach with Gemini AI"""
#         self.api_key = settings.GOOGLE_API_KEY
#         if not self.api_key:
#             logger.warning("GOOGLE_API_KEY not set. Interview coach will not work.")
#             return
        
#         genai.configure(api_key=self.api_key)
#         self.llm = ChatGoogleGenerativeAI(
#             model=settings.AI_MODEL,
#             temperature=0.8,
#             max_tokens=settings.AI_MAX_TOKENS
#         )
    
#     async def generate_question(self, role: str, difficulty: str = "medium", context: str = "") -> str:
#         """Generate an interview question based on role and difficulty"""
#         prompt = PromptTemplate(
#             input_variables=["role", "difficulty", "context"],
#             template="""
#             You are an expert technical interviewer at a FAANG company.
#             Generate a challenging interview question for a {role} position.
            
#             Difficulty Level: {difficulty}
#             {context}
            
#             Guidelines:
#             - {difficulty} level questions should be appropriately challenging
#             - Include both technical and behavioral aspects
#             - Make it specific to the role
#             - Ensure it's clear and actionable
            
#             Return ONLY the question text, no additional text or context.
#             """
#         )
        
#         chain = prompt | self.llm
#         result = await chain.ainvoke({
#             "role": role,
#             "difficulty": difficulty,
#             "context": context
#         })
        
#         return result.content.strip()
    
#     async def evaluate_answer(self, question: str, answer: str, role: str) -> Dict[str, Any]:
#         """Evaluate a candidate's answer and provide feedback"""
#         prompt = PromptTemplate(
#             input_variables=["question", "answer", "role"],
#             template="""
#             You are an expert interviewer evaluating a candidate's response for a {role} position.
            
#             Question asked: {question}
#             Candidate's answer: {answer}
            
#             Provide a detailed evaluation with:
#             1. Score (0-100)
#             2. Strengths of the answer
#             3. Areas for improvement
#             4. What a better answer would include
#             5. Suggested follow-up questions
            
#             Return your evaluation as a JSON object with the following structure:
#             {{
#                 "score": 0-100,
#                 "strengths": ["strength1", "strength2"],
#                 "improvements": ["improvement1", "improvement2"],
#                 "better_answer_key_points": ["point1", "point2"],
#                 "follow_up_questions": ["question1", "question2"]
#             }}
            
#             Return ONLY valid JSON, no markdown formatting.
#             """
#         )
        
#         chain = prompt | self.llm
#         result = await chain.ainvoke({
#             "question": question,
#             "answer": answer,
#             "role": role
#         })
        
#         import json
#         try:
#             evaluation = json.loads(result.content.strip())
#             return evaluation
#         except:
#             return {
#                 "score": 0,
#                 "strengths": ["Unable to evaluate"],
#                 "improvements": ["Please try again"],
#                 "better_answer_key_points": [],
#                 "follow_up_questions": []
#             }
    
#     async def generate_feedback(self, evaluation: Dict[str, Any]) -> str:
#         """Generate constructive feedback from evaluation"""
#         if not evaluation:
#             return "Please provide a more detailed answer for better evaluation."
        
#         score = evaluation.get("score", 0)
#         strengths = evaluation.get("strengths", [])
#         improvements = evaluation.get("improvements", [])
        
#         feedback_parts = []
        
#         if score >= 80:
#             feedback_parts.append("Excellent answer! You've demonstrated strong understanding.")
#         elif score >= 60:
#             feedback_parts.append("Good answer. You're on the right track.")
#         elif score >= 40:
#             feedback_parts.append("Decent answer. There's room for improvement.")
#         else:
#             feedback_parts.append("Your answer needs significant improvement. Let's work on it.")
        
#         if strengths:
#             feedback_parts.append(f"Strengths: {', '.join(strengths[:3])}")
        
#         if improvements:
#             feedback_parts.append(f"Areas to improve: {', '.join(improvements[:3])}")
        
#         return " ".join(feedback_parts)
    
#     async def get_next_question_strategy(self, previous_scores: List[float]) -> str:
#         """Determine the next question difficulty based on previous performance"""
#         if not previous_scores:
#             return "medium"
        
#         avg_score = sum(previous_scores) / len(previous_scores)
        
#         if avg_score >= 80:
#             return "hard"
#         elif avg_score >= 60:
#             return "medium"
#         else:
#             return "easy"