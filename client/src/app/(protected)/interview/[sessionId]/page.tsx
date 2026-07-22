// app/interview/[sessionId]/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    IconMessageChatbot,
    IconSend,
    IconBrain,
    IconClock,
    IconArrowLeft,
    IconStar,
    IconDeviceAnalytics,
    IconCircleCheck,
    IconCircleX,
} from '@tabler/icons-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'

interface Message {
    id: string
    type: 'user' | 'assistant' | 'system'
    content: string
    questionNumber?: number
    totalQuestions?: number
    score?: number
    feedback?: string
    isQuestion?: boolean
}

interface InterviewSession {
    session_id: string
    role: string
    difficulty: string
    status: string
    total_questions: number
    current_question: number
    average_score: number | null
    questions: string[]
    created_at: string
    strengths: string[] | null
    weaknesses: string[] | null
    recommendations: string[] | null
}

interface AnswerResponse {
    answer_id: number
    score: number
    feedback: string
    next_question: string | null
    interview_completed: boolean
    average_score: number | null
}

export default function ActiveInterview() {
    const params = useParams()
    const router = useRouter()
    const sessionId = params.sessionId as string
    
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<InterviewSession | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [currentQuestion, setCurrentQuestion] = useState<string>('')
    const [questionIndex, setQuestionIndex] = useState(0)
    const [input, setInput] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [averageScore, setAverageScore] = useState<number | null>(null)
    const [scores, setScores] = useState<number[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchSession = async () => {
            setLoading(true)
            try {
                const response = await api.get(`/api/interview/${sessionId}`)
                const data = response.data
                setSession(data)

                if (data.status === 'completed') {
                    setIsComplete(true)
                    setShowResults(true)
                    setAverageScore(data.average_score)
                    setLoading(false)
                    return
                }

                const questions = data.questions || []
                const currentIdx = data.current_question || 0

                setQuestionIndex(currentIdx)
                setCurrentQuestion(questions[currentIdx] || '')

                const initialMessages: Message[] = [
                    {
                        id: 'welcome',
                        type: 'assistant',
                        content: `Welcome to your ${data.role} interview! I'll be your AI interviewer. Let's get started with the first question.`,
                    },
                    {
                        id: 'question-1',
                        type: 'assistant',
                        content: questions[currentIdx] || '',
                        isQuestion: true,
                        questionNumber: currentIdx + 1,
                        totalQuestions: questions.length,
                    }
                ]
                setMessages(initialMessages)
                
            } catch (error) {
                console.error('Error fetching session:', error)
                toast.error('Failed to load interview session')
                router.push('/interview')
            } finally {
                setLoading(false)
            }
        }
        fetchSession()
    }, [router, sessionId])


    const sendAnswer = async () => {
        if (!input.trim() || isSending) return
        if (!session || !currentQuestion) return

        const userAnswer = input.trim()
        setInput('')
        setIsSending(true)

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            type: 'user',
            content: userAnswer,
        }
        setMessages(prev => [...prev, userMessage])

        try {
            const response = await api.post<AnswerResponse>(`/api/interview/${sessionId}/answer`, {
                current_question: questionIndex,
                question: currentQuestion,
                answer: userAnswer,
            })

            const data = response.data

            // Add AI evaluation message
            const evalMessage: Message = {
                id: `eval-${Date.now()}`,
                type: 'assistant',
                content: data.feedback || 'Good effort!',
                score: data.score,
                isQuestion: false,
            }
            setMessages(prev => [...prev, evalMessage])

            // Track scores
            if (data.score !== undefined) {
                setScores(prev => [...prev, data.score])
            }

            // Check if interview is complete
            if (data.interview_completed) {
                setIsComplete(true)
                setAverageScore(data.average_score)
                
                // Add completion message
                const completeMsg: Message = {
                    id: 'complete',
                    type: 'system',
                    content: `🎉 Interview Complete! Your average score is ${data.average_score?.toFixed(1)}%. Check your results below.`,
                }
                setMessages(prev => [...prev, completeMsg])
                
                // Fetch updated session with results
                const sessionRes = await api.get(`/api/interview/${sessionId}`)
                setSession(sessionRes.data)
                
                setShowResults(true)
            } else if (data.next_question) {
                // Move to next question
                const nextIdx = questionIndex + 1
                setQuestionIndex(nextIdx)
                setCurrentQuestion(data.next_question)
                
                // Add next question message
                const nextMsg: Message = {
                    id: `question-${Date.now()}`,
                    type: 'assistant',
                    content: data.next_question,
                    isQuestion: true,
                    questionNumber: nextIdx + 1,
                    totalQuestions: session.total_questions,
                }
                setMessages(prev => [...prev, nextMsg])
                
                // Update session current_question
                setSession(prev => prev ? {
                    ...prev,
                    current_question: nextIdx
                } : null)
            }

        } catch (error: unknown) {
            console.error('Error sending answer:', error);
            toast.error("Error: Something went wrong.");
            
            // Remove the user message on error
            setMessages(prev => prev.filter(m => m.id !== `user-${Date.now()}`))
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendAnswer()
        }
    }

    const renderResults = () => {
        if (!session) return null
        
        const strengths = session.strengths || []
        const weaknesses = session.weaknesses || []
        const recommendations = session.recommendations || []
        
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card-bg rounded-2xl border border-border p-6 mt-6"
            >
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                    <IconDeviceAnalytics className="text-orange-400" size={28} />
                    Interview Results
                </h2>

                {/* Score */}
                <div className="bg-background rounded-xl p-6 border border-border mb-6">
                    <div className="flex sm:flex-row flex-col items-center justify-between gap-8">
                        <div>
                            <p className="text-gray-400">Average Score</p>
                            <p className="text-4xl font-bold text-orange-400">
                                {averageScore?.toFixed(1)}%
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-20 h-20 rounded-full bg-linear-to-r from-orange-500/20 to-purple-600/20 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">
                                    {scores.length}/{session.total_questions}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">Questions</p>
                        </div>
                    </div>
                </div>

                <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                    {strengths.length > 0 && (
                        <div className="bg-background rounded-xl p-6 border border-border">
                            <h3 className="text-base font-medium text-gray-400 mb-4 flex items-center gap-2">
                                <IconCircleCheck className="text-green-400" size={18} /> Strengths
                            </h3>
                            <div className="space-y-2">
                                {strengths.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 text-green-400">
                                        <span className="text-green-400">•</span>
                                        <span className="text-gray-300 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {weaknesses.length > 0 && (
                        <div className="bg-background rounded-xl p-6 border border-border">
                            <h3 className="text-base font-medium text-gray-400 mb-4 flex items-center gap-2">
                                <IconCircleX className="text-yellow-400" size={18} /> Areas for Improvement
                            </h3>
                            <div className="space-y-2">
                                {weaknesses.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 text-yellow-400">
                                        <span className="text-yellow-400">•</span>
                                        <span className="text-gray-300 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {recommendations.length > 0 && (
                        <div className="bg-background rounded-xl p-6 border border-border">
                            <h3 className="text-base font-medium text-gray-400 mb-4 flex items-center gap-2">
                                <IconStar className="text-purple-400" size={18} /> Recommendations
                            </h3>
                            <div className="space-y-2">
                                {recommendations.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 text-purple-400">
                                        <span className="text-purple-400">•</span>
                                        <span className="text-gray-300 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex sm:flex-row flex-col items-center justify-center gap-3 mt-6 pt-4 border-t border-border">
                    <Link
                        href="/interview"
                        className="inline-flex items-center gap-2 bg-card-bg border border-border text-gray-300 px-6 py-2.5 rounded-lg hover:bg-card-hover transition-colors"
                    >
                        <IconArrowLeft size={18} />
                        Back to Interviews
                    </Link>
                    <Link
                        href={`/interview?start=true`}
                        className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                    >
                        <IconMessageChatbot size={18} />
                        New Interview
                    </Link>
                </div>
            </motion.div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading interview...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Interview Not Found</h2>
                    <p className="text-gray-400 mt-2">The interview session could not be found</p>
                    <Link
                        href="/interview"
                        className="mt-4 inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                    >
                        <IconArrowLeft size={18} />
                        Back to Interviews
                    </Link>
                </div>
            </div>
        )
    }

    if (showResults) {
        return (
            <div className="bg-background py-8">
                <div className="container mx-auto px-4">
                    <Link
                        href="/interview"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <IconArrowLeft size={18} />
                        Back to Interviews
                    </Link>
                    {renderResults()}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Link
                            href="/interview"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2"
                        >
                            <IconArrowLeft size={18} />
                            Back to Interviews
                        </Link>
                        <h1 className="text-2xl font-bold text-white">{session.role} Interview</h1>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                            <span className="capitalize">{session.difficulty}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <IconClock size={14} />
                                {questionIndex + 1}/{session.total_questions} questions
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-border rounded-full overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-orange-500 to-purple-600 rounded-full transition-all"
                                style={{ width: `${((questionIndex + 1) / session.total_questions) * 100}%` }}
                            />
                        </div>
                        <span className="text-sm text-gray-400">
                            {Math.round(((questionIndex + 1) / session.total_questions) * 100)}%
                        </span>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="bg-card-bg rounded-2xl border border-border overflow-hidden">
                    <div className="p-4 bg-linear-to-r from-orange-500/10 to-purple-600/10 border-b border-border">
                        <div className="flex items-center gap-3">
                            <IconBrain className="text-orange-400" size={20} />
                            <span className="font-semibold text-white">AI Interview Coach</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-125 overflow-y-auto p-4 space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-4 rounded-lg ${
                                            message.type === 'user'
                                                ? 'bg-linear-to-r from-orange-500 to-purple-600 text-white'
                                                : message.type === 'system'
                                                ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                                                : 'bg-background text-gray-200 border border-border'
                                        }`}
                                    >
                                        {message.isQuestion && (
                                            <div className="text-xs text-gray-400 mb-1">
                                                Question {message.questionNumber}/{message.totalQuestions}
                                            </div>
                                        )}
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                        {message.score !== undefined && (
                                            <div className="mt-2 pt-2 border-t border-border/50">
                                                <span className="text-sm text-orange-400">Score: {message.score}%</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    {!isComplete && (
                        <div className="p-4 border-t border-border">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your answer..."
                                    disabled={isSending}
                                    className="flex-1 px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 disabled:opacity-50"
                                />
                                <button
                                    onClick={sendAnswer}
                                    disabled={isSending || !input.trim()}
                                    className="bg-linear-to-r from-orange-500 to-purple-600 text-white p-2.5 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSending ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                    ) : (
                                        <IconSend size={20} />
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                Press Enter to send your answer
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}