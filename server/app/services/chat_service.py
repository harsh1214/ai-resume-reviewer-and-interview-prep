# from loguru import logger
# from langgraph.graph import StateGraph, MessagesState
# from langgraph.checkpoint.sqlite import SqliteSaver
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from app.config import settings
# import os
# import sqlite3

# class ChatService:
#     def __init__(self):
#         """Initialize the chat service with LangGraph for stateful conversations"""
#         self.api_key = settings.GOOGLE_API_KEY
#         if not self.api_key:
#             logger.warning("GOOGLE_API_KEY not set. Chat service will not work.")
#             return
        
#         self.llm = ChatGoogleGenerativeAI(
#             model=settings.AI_MODEL,
#             temperature=0.8,
#             max_tokens=settings.AI_MAX_TOKENS
#         )
        
#         # Initialize SQLite checkpointer for persistent memory
#         db_path = "conversations.db"
#         if not os.path.exists(db_path):
#             # Create database
#             conn = sqlite3.connect(db_path)
#             conn.close()
        
#         self.memory = SqliteSaver.from_conn_string(db_path)
#         self.agent = self._build_graph()
    
#     def _build_graph(self):
#         """Build the conversation graph with memory"""
#         workflow = StateGraph(MessagesState)
        
#         def call_model(state: MessagesState):
#             """Invoke the LLM with conversation history"""
#             prompt = ChatPromptTemplate.from_messages([
#                 ("system", """You are an AI career coach and interview mentor.
#                 You help candidates prepare for job interviews, improve their resumes,
#                 and navigate their career journey.
                
#                 Guidelines:
#                 - Be professional, encouraging, and constructive
#                 - Provide specific, actionable advice
#                 - Ask thoughtful follow-up questions
#                 - Draw from your knowledge of careers, tech, and interviews
#                 - Always be honest but diplomatic in your feedback
#                 - Adapt your responses to the user's experience level
#                 """),
#                 MessagesPlaceholder(variable_name="messages")
#             ])
            
#             chain = prompt | self.llm
#             response = chain.invoke({"messages": state["messages"]})
#             return {"messages": [response]}
        
#         workflow.add_node("model", call_model)
#         workflow.set_entry_point("model")
#         workflow.set_finish_point("model")
        
#         # Compile with checkpointer for persistent memory
#         return workflow.compile(checkpointer=self.memory)
    
#     async def chat(self, thread_id: str, user_message: str) -> str:
#         """
#         Handle a chat message with persistent conversation memory.
        
#         The thread_id is used to maintain conversation context across sessions.
#         """
#         try:
#             config = {"configurable": {"thread_id": thread_id}}
            
#             # The checkpointer automatically loads conversation history
#             response = await self.agent.ainvoke(
#                 {"messages": [("user", user_message)]},
#                 config=config
#             )
            
#             # Extract the last message from the response
#             if response.get("messages"):
#                 last_message = response["messages"][-1]
#                 if hasattr(last_message, "content"):
#                     return last_message.content
            
#             return "I received your message but couldn't generate a response. Please try again."
            
#         except Exception as e:
#             logger.error(f"Chat service error: {e}")
#             return f"An error occurred: {str(e)}"
    
#     async def clear_conversation(self, thread_id: str) -> bool:
#         """Clear conversation history for a thread"""
#         try:
#             # Clear by starting a new thread with the same ID
#             config = {"configurable": {"thread_id": thread_id}}
            
#             # Reset the thread
#             await self.agent.ainvoke(
#                 {"messages": [("user", "Start fresh conversation")]},
#                 config=config
#             )
#             return True
#         except Exception as e:
#             logger.error(f"Failed to clear conversation: {e}")
#             return False