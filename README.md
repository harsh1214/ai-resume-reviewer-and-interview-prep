## 🚀 AI Resume Reviewer & Interview Prep

An AI-powered platform that helps job seekers improve their resumes, analyze ATS compatibility, and prepare for interviews with personalized AI-generated mock interview sessions.

🌐 **Live Demo:** https://ai-resume-reviewer-and-interview-pr.vercel.app/

---

### 📌 Features

#### 🔐 Authentication
- User Registration & Login
- JWT Authentication (Access & Refresh Tokens)
- Protected Routes
- Password Hashing using Bcrypt
- Email Verification & OTP Support
- Password Reset

#### 📄 Resume Analysis
- Upload Resume (PDF/DOCX)
- AI-powered Resume Analysis
- ATS Compatibility Score
- Resume Strengths & Weaknesses
- Improvement Suggestions
- Resume Metadata Storage

#### 🤖 AI Mock Interview
- Personalized Interview Questions based on Resume
- Role & Difficulty Selection
- One Question at a Time Interview Flow
- AI Evaluation of Each Answer
- Detailed Feedback
- Technical Accuracy Scoring
- Communication Scoring
- Problem Solving Evaluation
- Confidence Assessment
- Final Interview Report
- Average Performance Score

#### 📊 Dashboard
- Resume History
- Interview History
- ATS Scores
- Performance Analytics
- User Profile Management

---

## 🛠 Tech Stack

### Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- Zustand
- Lucide Icons

---

### Backend

- FastAPI
- Python
- SQLAlchemy
- PostgreSQL
- Alembic
- AsyncPG
- Pydantic v2
- JWT Authentication
- Passlib (Bcrypt)
- Loguru

---

### AI

- Google Gemini API
- Prompt Engineering
- Structured JSON Responses
- AI Resume Analysis
- AI Interview Question Generation
- AI Answer Evaluation
- AI Final Interview Report

---

### Storage

- PostgreSQL

---

### Deployment

#### Frontend
- Vercel

#### Backend
- Render

#### Database
- PostgreSQL

---

## 📂 Project Structure

```text
client/
│
├── app/
├── components/
├── hooks/
├── lib/
├── services/
└── store/

server/
│
├── app/
│   ├── routers/
│   ├── models/
│   ├── schemas/
│   ├── services/
│   ├── utils/
│   ├── database.py
│   └── main.py
│
├── uploads/
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/harsh1214/ai-resume-reviewer-and-interview-prep.git
cd ai-resume-reviewer
```

---

### Backend

```bash
cd server

python -m venv .venv

source .venv/bin/activate
# Windows
.venv\Scripts\activate

pip install -r requirements.txt

alembic upgrade head

uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd client

npm install

npm run dev
```

---

## API Highlights

#### Authentication

- Register
- Login
- Refresh Token
- Forgot Password
- Reset Password
- Change Email

#### Resume

- Upload Resume
- Analyze Resume
- Get Resume History
- Delete Resume

#### Interview

- Start Interview
- Submit Answer
- Get Interview Progress
- Generate Final Report

---

## AI Workflow

1. User uploads resume.
2. Resume text is extracted from PDF/DOCX.
3. Gemini analyzes the resume.
4. ATS score and improvement suggestions are generated.
5. AI creates personalized interview questions.
6. User answers questions one by one.
7. Gemini evaluates every response.
8. Final interview report is generated with strengths, weaknesses, recommendations, and overall performance score.

---

## Security

- JWT Authentication
- Password Hashing with Bcrypt
- Protected API Routes
- Input Validation using Pydantic
- Secure File Upload
- Environment Variable Configuration

---

## Live Demo

🌐 https://ai-resume-reviewer-and-interview-pr.vercel.app/
