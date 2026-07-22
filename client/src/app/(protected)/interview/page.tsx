// app/interview/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { IconMessageChatbot, IconBrain, IconChartBar, IconClock, IconCheck, IconFileText, IconRefresh, IconArrowRight, IconList, IconEye, IconTrash, IconCalendar, IconStar, IconBriefcase } from '@tabler/icons-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import Link from 'next/link'

interface Resume {
    resume_id: string
    filename: string
    ats_score: number
    analysis_results: {
        skills: {
            technical: string[]
            soft: string[]
        }
    }
}

interface InterviewSession {
    session_id: string
    role: string
    difficulty: string
    status: 'active' | 'completed' | 'abandoned'
    total_questions: number
    current_question: number
    average_score: number | null
    created_at: string
    completed_at: string | null
    strengths: string[] | null
    weaknesses: string[] | null
    recommendations: string[] | null
}

export default function InterviewDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [resumes, setResumes] = useState<Resume[]>([])
    const [sessions, setSessions] = useState<InterviewSession[]>([])
    const [selectedResume, setSelectedResume] = useState<string>('')
    const [role, setRole] = useState('')
    const [difficulty, setDifficulty] = useState('medium')
    const [isStarting, setIsStarting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const [resumesRes, sessionsRes] = await Promise.all([api.get('/api/resume/get/resumes'), api.get('/api/interview')])
                setResumes(resumesRes.data)
                setSessions(sessionsRes.data)
            } catch (error) {
                console.error('Error fetching data:', error)
                toast.error('Failed to load data')
            } finally {
                setLoading(false)
            }
    
        }
        fetchData()
    }, [])

    const handleRefresh = () => {
        router.refresh()
    }

    const startInterview = async () => {
        if (!selectedResume) {
            toast.error('Please select a resume')
            return
        }
        if (!role) {
            toast.error('Please enter a role')
            return
        }

        setIsStarting(true)
        try {
            const response = await api.post('/api/interview/start', {
                resume_id: selectedResume,
                role: role,
                difficulty: difficulty
            })
            
            toast.success('Interview started!')
            router.push(`/interview/${response.data.session_id}`)
        } catch (error) {
            console.error('Error starting interview:', error)
            toast.error('Failed to start interview')
        } finally {
            setIsStarting(false)
        }
    }

    const deleteSession = async (sessionId: string) => {
        if (!confirm('Are you sure you want to delete this interview session?')) return
        
        setDeletingId(sessionId)
        try {
            await api.delete(`/api/interview/${sessionId}`)
            toast.success('Interview session deleted')
            setSessions(sessions.filter(s => s.session_id !== sessionId))
        } catch (error) {
            console.error('Error deleting session:', error)
            toast.error('Failed to delete session')
        } finally {
            setDeletingId(null)
        }
    }

    const getStatusBadge = (status: string) => {
        const statusMap = {
            'active': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'In Progress' },
            'completed': { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Completed' },
            'abandoned': { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Abandoned' },
        }
        return statusMap[status as keyof typeof statusMap] || statusMap['active']
    }

    const getDifficultyBadge = (difficulty: string) => {
        const diffMap = {
            'easy': { color: 'bg-green-500/20 text-green-400', label: 'Easy' },
            'medium': { color: 'bg-yellow-500/20 text-yellow-400', label: 'Medium' },
            'hard': { color: 'bg-red-500/20 text-red-400', label: 'Hard' },
        }
        return diffMap[difficulty as keyof typeof diffMap] || diffMap['medium']
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
                    <p className="text-gray-400 mt-4">Loading interview data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background py-8 lg:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Interview Practice</h1>
                            <p className="text-gray-400 mt-1">
                                {sessions.length === 0 
                                    ? 'No interviews yet. Start your first one!' 
                                    : `${sessions.length} interview${sessions.length > 1 ? 's' : ''} completed`}
                            </p>
                        </div>
                        <button onClick={handleRefresh} className="inline-flex items-center cursor-pointer gap-2 bg-card-bg border border-border text-gray-300 px-4 py-2 rounded-lg hover:bg-card-hover transition-colors">
                            <IconRefresh size={18} />
                            <span>Refresh</span>
                        </button>
                    </div>

                    {sessions.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-card-bg rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2">
                                    <IconBrain className="text-orange-400" size={18} />
                                    <p className="text-sm text-gray-400">Total Interviews</p>
                                </div>
                                <p className="text-2xl font-bold text-white mt-1">{sessions.length}</p>
                            </div>
                            <div className="bg-card-bg rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2">
                                    <IconCheck className="text-green-400" size={18} />
                                    <p className="text-sm text-gray-400">Completed</p>
                                </div>
                                <p className="text-2xl font-bold text-green-400 mt-1">
                                    {sessions.filter(s => s.status === 'completed').length}
                                </p>
                            </div>
                            <div className="bg-card-bg rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2">
                                    <IconChartBar className="text-orange-400" size={18} />
                                    <p className="text-sm text-gray-400">Average Score</p>
                                </div>
                                <p className="text-2xl font-bold text-orange-400 mt-1">
                                    {(() => {
                                        const completed = sessions.filter(s => s.status === 'completed' && s.average_score !== null)
                                        if (completed.length === 0) return '—'
                                        const avg = completed.reduce((acc, s) => acc + (s.average_score || 0), 0) / completed.length
                                        return Math.round(avg) + '%'
                                    })()}
                                </p>
                            </div>
                            <div className="bg-card-bg rounded-xl p-4 border border-border">
                                <div className="flex items-center gap-2">
                                    <IconClock className="text-blue-400" size={18} />
                                    <p className="text-sm text-gray-400">In Progress</p>
                                </div>
                                <p className="text-2xl font-bold text-blue-400 mt-1">
                                    {sessions.filter(s => s.status === 'active').length}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="bg-card-bg rounded-2xl border border-border p-6 mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <IconMessageChatbot className="text-orange-400" size={24} />
                            Start New Interview
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Select Resume
                                </label>
                                <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option value="">Choose a resume...</option>
                                    {resumes.map((resume) => (
                                        <option key={resume.resume_id} value={resume.resume_id}>
                                            {resume.filename} {resume.ats_score ? `(${resume.ats_score}%)` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Role / Position
                                </label>
                                <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g., Software Engineer" className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Difficulty
                                </label>
                                <div className="grid sm:grid-cols-3 grid-cols-1 gap-2">
                                    {['Easy', 'Medium', 'Hard'].map((level) => (
                                        <button key={level} onClick={() => setDifficulty(level.toLowerCase())} className={`px-3 py-2 rounded-lg transition-all ${difficulty === level.toLowerCase() ? 'bg-linear-to-r from-orange-500 to-purple-600 text-white' : 'bg-background border border-border text-gray-400 hover:border-orange-500/30'}`}>
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={startInterview} disabled={isStarting || !selectedResume || !role} className="mt-4 inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                            {isStarting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                    <span>Starting...</span>
                                </>
                            ) : (
                                <>
                                    <IconMessageChatbot size={18} />
                                    <span>Start Interview</span>
                                    <IconArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </div>

                    <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <IconList className="text-purple-400" size={24} />
                        Interview History
                    </h2>

                    {sessions.length === 0 ? (
                        <div className="bg-card-bg rounded-2xl border border-border p-12 text-center">
                            <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                                <IconMessageChatbot className="text-orange-400" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Interview Sessions</h3>
                            <p className="text-gray-400 mb-6">Start your first AI-powered interview practice session</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {sessions.map((session) => {
                                const status = getStatusBadge(session.status)
                                const difficulty = getDifficultyBadge(session.difficulty)
                                const isCompleted = session.status === 'completed'
                                
                                return (
                                    <motion.div key={session.session_id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card-bg rounded-2xl border border-border hover:border-orange-500/30 transition-all p-5">
                                        <div className="flex md:flex-row flex-col flex-wrap items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center flex-wrap gap-3 mb-6">
                                                    <div className="w-fit flex flex-row items-center gap-3">
                                                        <IconBriefcase className="text-orange-400" size={20} />
                                                        <h3 className="font-semibold text-white">
                                                            {session.role}
                                                        </h3>
                                                    </div>
                                                    <div className="w-fit flex flex-row items-center gap-3 flex-wrap">
                                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${difficulty.color}`}>
                                                            {difficulty.label}
                                                        </span>
                                                        <span className={`text-xs px-2.5 py-1 rounded-full border ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <IconCalendar size={14} />
                                                        {formatDate(session.created_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <IconFileText size={14} />
                                                        {session.total_questions} questions
                                                    </span>
                                                    {isCompleted && session.average_score !== null && (
                                                        <span className="flex items-center gap-1">
                                                            <IconStar size={14} className="text-yellow-400" />
                                                            <span className="font-semibold text-orange-400">{session.average_score}%</span>
                                                        </span>
                                                    )}
                                                    {session.status === 'active' && (
                                                        <span className="flex items-center gap-1 text-blue-400">
                                                            <IconClock size={14} className="animate-pulse" />
                                                            {session.current_question}/{session.total_questions}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {session.status === 'active' ? (
                                                    <Link href={`/interview/${session.session_id}`} className="inline-flex items-center gap-1.5 bg-linear-to-r from-orange-500 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                                                        <IconEye size={16} />
                                                        Continue
                                                    </Link>
                                                ) : (
                                                    <Link href={`/interview/${session.session_id}`} className="inline-flex items-center gap-1.5 bg-card-bg border border-border text-gray-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-card-hover transition-all">
                                                        <IconEye size={16} />
                                                        View Results
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => deleteSession(session.session_id)}
                                                    disabled={deletingId === session.session_id}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                                                >
                                                    {deletingId === session.session_id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent" />
                                                    ) : (
                                                        <IconTrash size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}