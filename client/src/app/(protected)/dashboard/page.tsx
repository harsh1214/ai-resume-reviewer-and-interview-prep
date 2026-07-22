// app/(protected)/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    IconFileText,
    IconMessageChatbot,
    IconHistory,
    IconChartBar,
    IconFiles,
    IconBrain,
    IconUpload,
    IconPlus,
    IconArrowRight,
    IconClock,
    IconCheck,
    IconX,
    IconCalendar,
    IconStar,
} from '@tabler/icons-react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface DashboardStats {
    total_resumes: number
    total_analyses: number
    average_ats_score: number
    total_interviews: number
    completed_interviews: number
    active_interviews: number
    average_interview_score: number
    recent_resumes: {
        id: number
        filename: string
        ats_score: number | null
        status: string
        resume_id: string
        created_at: string
    }[]
    recent_interviews: {
        session_id: string
        role: string
        difficulty: string
        status: string
        average_score: number | null
        created_at: string
    }[]
}

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats | null>(null)

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                // Fetch all resumes
                const resumesRes = await api.get('/api/resume/get/resumes')
                const resumes = resumesRes.data || []
                
                // Fetch all interviews
                const interviewsRes = await api.get('/api/interview')
                const interviews = interviewsRes.data || []
    
                // Calculate stats
                const completedResumes = resumes.filter((r: { status: string}) => r.status === 'completed')
                const completedInterviews = interviews.filter((i: { status: string }) => i.status === 'completed')
                const activeInterviews = interviews.filter((i: { status: string }) => i.status === 'active')
                
                const atsScores = completedResumes
                    .map((r: { ats_score: number }) => r.ats_score)
                    .filter((s: { status: string}) => s !== null && s !== undefined)
                
                const interviewScores = completedInterviews
                    .map((i: { average_score: number }) => i.average_score)
                    .filter((s: { status: string}) => s !== null && s !== undefined)
    
                setStats({
                    total_resumes: resumes.length,
                    total_analyses: completedResumes.length,
                    average_ats_score: atsScores.length > 0 
                        ? Math.round(atsScores.reduce((a: number, b: number) => a + b, 0) / atsScores.length)
                        : 0,
                    total_interviews: interviews.length,
                    completed_interviews: completedInterviews.length,
                    active_interviews: activeInterviews.length,
                    average_interview_score: interviewScores.length > 0
                        ? Math.round(interviewScores.reduce((a: number, b: number) => a + b, 0) / interviewScores.length)
                        : 0,
                    recent_resumes: resumes.slice(0, 3).map((r: { id: number, resume_id: string, filename: string, ats_score: number | null, status: string, created_at: string}) => ({
                        id: r.id,
                        resume_id: r.resume_id,
                        filename: r.filename,
                        ats_score: r.ats_score,
                        status: r.status,
                        created_at: r.created_at
                    })),
                    recent_interviews: interviews.slice(0, 3).map((i: { session_id: string, role: string, difficulty: string, status: string, average_score: number | null, created_at: string}) => ({
                        session_id: i.session_id,
                        role: i.role,
                        difficulty: i.difficulty,
                        status: i.status,
                        average_score: i.average_score,
                        created_at: i.created_at
                    }))
                })
            } catch (error) {
                console.error('Error fetching dashboard data:', error)
                toast.error('Failed to load dashboard data')
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])


    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
            'pending': { 
                color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 
                label: 'Pending',
                icon: <IconClock size={12} />
            },
            'completed': { 
                color: 'bg-green-500/20 text-green-400 border-green-500/30', 
                label: 'Completed',
                icon: <IconCheck size={12} />
            },
            'failed': { 
                color: 'bg-red-500/20 text-red-400 border-red-500/30', 
                label: 'Failed',
                icon: <IconX size={12} />
            },
            'active': { 
                color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', 
                label: 'Active',
                icon: <IconClock size={12} className="animate-pulse" />
            },
        }
        return statusMap[status] || statusMap['pending']
    }

    const getScoreColor = (score: number | null) => {
        if (score === null) return 'text-gray-400'
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-yellow-400'
        return 'text-red-400'
    }

    if (loading) {
        return (
            <div className="bg-background min-h-screen py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
                            <p className="text-gray-400 mt-4">Loading dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background py-8 lg:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                            <p className="text-gray-400 mt-1">
                                Welcome back! Here&apos;s your career progress overview
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/resumes/upload" className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all font-semibold">
                                <IconUpload size={18} />
                                <span>New Analysis</span>
                            </Link>
                            <Link href="/interview" className="inline-flex items-center gap-2 bg-card-bg border border-border text-gray-300 px-5 py-2.5 rounded-lg hover:bg-card-hover transition-all font-semibold">
                                <IconPlus size={18} />
                                <span>New Interview</span>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card-bg rounded-xl p-5 border border-border hover:border-orange-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-orange-500/20">
                                    <IconFiles className="text-orange-400" size={18} />
                                </div>
                                <p className="text-sm text-gray-400">Total Resumes</p>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats?.total_resumes || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats?.total_analyses || 0} analyzed
                            </p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card-bg rounded-xl p-5 border border-border hover:border-green-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <IconChartBar className="text-green-400" size={18} />
                                </div>
                                <p className="text-sm text-gray-400">Avg ATS Score</p>
                            </div>
                            <p className="text-3xl font-bold text-green-400">
                                {stats?.average_ats_score || 0}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Across {stats?.total_analyses || 0} resumes
                            </p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card-bg rounded-xl p-5 border border-border hover:border-purple-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <IconBrain className="text-purple-400" size={18} />
                                </div>
                                <p className="text-sm text-gray-400">Interviews</p>
                            </div>
                            <p className="text-3xl font-bold text-white">{stats?.total_interviews || 0}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-green-400">
                                    {stats?.completed_interviews || 0} completed
                                </span>
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card-bg rounded-xl p-5 border border-border hover:border-yellow-500/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-yellow-500/20">
                                    <IconStar className="text-yellow-400" size={18} />
                                </div>
                                <p className="text-sm text-gray-400">Interview Score</p>
                            </div>
                            <p className={`text-3xl font-bold ${getScoreColor(stats?.average_interview_score || null)}`}>
                                {stats?.average_interview_score || 0}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Average across {stats?.completed_interviews || 0} sessions
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <Link href="/resumes/upload" className="group bg-linear-to-r from-orange-500 to-orange-600 text-white p-5 rounded-xl shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all hover:scale-[1.02] transform">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">Upload Resume</h3>
                                    <p className="text-sm opacity-80">Get AI-powered analysis</p>
                                </div>
                                <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                                    <IconFileText size={24} />
                                </div>
                            </div>
                        </Link>

                        <Link href="/interview" className="group bg-linear-to-r from-purple-500 to-purple-600 text-white p-5 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all hover:scale-[1.02] transform">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">Mock Interview</h3>
                                    <p className="text-sm opacity-80">Practice with AI coach</p>
                                </div>
                                <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                                    <IconMessageChatbot size={24} />
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <IconFileText size={20} className="text-orange-400" />
                                    Recent Resumes
                                </h2>
                                <Link href="/resumes" className="text-sm text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1">
                                    View All
                                    <IconArrowRight size={14} />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {stats?.recent_resumes && stats.recent_resumes.length > 0 ? (
                                    stats.recent_resumes.map((resume) => {
                                        const status = getStatusBadge(resume.status)
                                        return (
                                            <Link key={resume.id} href={`/resumes/${resume.resume_id}`} className="block bg-card-bg rounded-xl p-4 border border-border hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-white truncate">
                                                                {resume.filename}
                                                            </p>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.color}`}>
                                                                {status.icon}
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <IconCalendar size={12} />
                                                                {formatDate(resume.created_at)}
                                                            </span>
                                                            {resume.ats_score && (
                                                                <span className={`font-medium ${getScoreColor(resume.ats_score)}`}>
                                                                    Score: {resume.ats_score}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <IconArrowRight size={16} className="text-gray-500 group-hover:text-orange-400 transition-colors" />
                                                </div>
                                            </Link>
                                        )
                                    })
                                ) : (
                                    <div className="bg-card-bg rounded-xl p-8 text-center border border-border">
                                        <p className="text-gray-400">No resumes uploaded yet</p>
                                        <Link href="/resumes/upload" className="mt-3 inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-sm">
                                            <IconUpload size={16} />
                                            Upload your first resume
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <IconMessageChatbot size={20} className="text-purple-400" />
                                    Recent Interviews
                                </h2>
                                <Link href="/interview" className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1">
                                    View All
                                    <IconArrowRight size={14} />
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {stats?.recent_interviews && stats.recent_interviews.length > 0 ? (
                                    stats.recent_interviews.map((interview) => {
                                        const status = getStatusBadge(interview.status)
                                        return (
                                            <Link
                                                key={interview.session_id}
                                                href={`/interview/${interview.session_id}`}
                                                className="block bg-card-bg rounded-xl p-4 border border-border hover:border-purple-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/5"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium text-white truncate">
                                                                {interview.role}
                                                            </p>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${status.color}`}>
                                                                {status.icon}
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                                            <span className="flex items-center gap-1">
                                                                <IconCalendar size={12} />
                                                                {formatDate(interview.created_at)}
                                                            </span>
                                                            <span className="capitalize">{interview.difficulty}</span>
                                                            {interview.average_score !== null && (
                                                                <span className={`font-medium ${getScoreColor(interview.average_score)}`}>
                                                                    Score: {interview.average_score}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <IconArrowRight size={16} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                                                </div>
                                            </Link>
                                        )
                                    })
                                ) : (
                                    <div className="bg-card-bg rounded-xl p-8 text-center border border-border">
                                        <p className="text-gray-400">No interview sessions yet</p>
                                        <Link href="/interview" className="mt-3 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm">
                                            <IconMessageChatbot size={16} />
                                            Start your first interview
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}