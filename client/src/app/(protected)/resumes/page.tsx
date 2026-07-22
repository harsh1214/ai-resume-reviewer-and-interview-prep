'use client'

import { motion } from 'framer-motion'
import { 
    IconUpload, 
    IconFileText, 
    IconChartBar, 
    IconCalendar, 
    IconClock, 
    IconEye, 
    IconTrash,
    IconFileDelta,
    IconFileWord
} from '@tabler/icons-react'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Resume {
    id: number;
    resume_id: string;
    user_id: string;
    filename: string;
    file_url: string;
    file_size: number;
    file_type: string;
    ats_score: number;
    content_score: number;
    skills_score: number;
    formatting_score: number;
    status: string;
    created_at: string;
    updated_at: string;
}

export default function Resumes() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        const fetchResumes = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/resume/get/resumes');
                setResumes(response.data);
            } catch (error) {
                console.error('Error fetching resumes:', error);
                toast.error('Failed to fetch resumes');
            } finally {
                setLoading(false);
            }
        };
        fetchResumes();
    }, []);


    const handleDelete = async (resume_id: string) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;
        
        setDeleting(resume_id);
        try {
            await api.delete(`/api/resume/${resume_id}`);
            toast.success('Resume deleted successfully');
            setResumes(resumes.filter(r => r.resume_id !== resume_id));
        } catch (error) {
            console.error('Error deleting resume:', error);
            toast.error('Failed to delete resume');
        } finally {
            setDeleting(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatFileSize = (bytes: number) => {
        if (!bytes) return 'Unknown';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getStatusBadge = (status: string) => {
        const statusMap = {
            'pending': { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Pending' },
            'analyzing': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Analyzing' },
            'completed': { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Completed' },
            'failed': { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Failed' },
        };
        return statusMap[status as keyof typeof statusMap] || statusMap['pending'];
    };

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <IconFileDelta className="text-red-400" size={24} />;
        if (ext === 'docx') return <IconFileWord className="text-blue-400" size={24} />;
        return <IconFileText className="text-gray-400" size={24} />;
    };

    if (loading) {
        return (
            <div className="bg-background min-h-screen py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto"></div>
                            <p className="text-gray-400 mt-4">Loading your resumes...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background w-full relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:py-20 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Resumes</h1>
                            <p className="text-gray-400 mt-1">
                                {resumes.length === 0 
                                    ? 'No resumes uploaded yet' 
                                    : `${resumes.length} resume${resumes.length > 1 ? 's' : ''} analyzed`
                                }
                            </p>
                        </div>
                        <Link href="/resumes/upload" className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all font-semibold">
                            <IconUpload size={18} />
                            <span>New Analysis</span>
                        </Link>
                    </div>

                    {/* Stats Summary */}
                    {resumes.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-card-bg rounded-xl p-4 border border-border">
                                <p className="text-sm text-gray-400">Total Resumes</p>
                                <p className="text-2xl font-bold text-white">{resumes.length}</p>
                            </div>
                            <div className="bg-card-bg rounded-xl p-4 border border-border">
                                <p className="text-sm text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-green-400">
                                    {resumes.filter(r => r.status === 'completed').length}
                                </p>
                            </div>
                            <div className="bg-card-bg rounded-xl p-4 border border-border">
                                <p className="text-sm text-gray-400">Average ATS Score</p>
                                <p className="text-2xl font-bold text-orange-400">
                                    {resumes.filter(r => r.ats_score).length > 0
                                        ? Math.round(resumes.filter(r => r.ats_score).reduce((acc, r) => acc + (r.ats_score || 0), 0) / resumes.filter(r => r.ats_score).length)
                                        : '—'}
                                    {resumes.filter(r => r.ats_score).length > 0 && '%'}
                                </p>
                            </div>
                            <div className="bg-card-bg rounded-xl p-4 border border-border">
                                <p className="text-sm text-gray-400">Pending Analysis</p>
                                <p className="text-2xl font-bold text-yellow-400">
                                    {resumes.filter(r => r.status === 'pending' || r.status === 'analyzing').length}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Resume Cards Grid */}
                    {resumes.length === 0 ? (
                        <div className="p-12 text-center max-w-3xl mx-auto">
                            <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                                <IconFileText className="text-orange-400" size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Resumes Yet</h3>
                            <p className="text-gray-400 mb-6">Upload your first resume to get AI-powered analysis</p>
                            <Link href="/resumes/upload" className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all font-semibold">
                                <IconUpload size={18} />
                                <span>Upload Resume</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes.map((resume, index) => {
                                const status = getStatusBadge(resume.status);
                                const isCompleted = resume.status === 'completed';
                                
                                return (
                                    <motion.div
                                        key={resume.resume_id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-card-bg rounded-2xl border border-border hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/5 group"
                                    >
                                        <div className="p-5">
                                            {/* File Info */}
                                            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-background border border-border">
                                                        {getFileIcon(resume.filename)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="font-semibold text-white truncate" title={resume.filename}>
                                                            {resume.filename}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                            <span>{formatFileSize(resume.file_size)}</span>
                                                            <span>•</span>
                                                            <span className="uppercase">{resume.file_type?.replace('.', '') || 'Unknown'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`text-xs px-2.5 py-1 rounded-full border ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>

                                            {/* Score & Date */}
                                            <div className="flex items-center justify-between text-sm mb-3">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <IconCalendar size={14} />
                                                    <span>{formatDate(resume.created_at)}</span>
                                                </div>
                                                {isCompleted && resume.ats_score !== null && (
                                                    <div className="flex items-center gap-1.5">
                                                        <IconChartBar size={14} className="text-orange-400" />
                                                        <span className="font-semibold text-orange-400">{resume.ats_score}%</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Score Breakdown (if completed) */}
                                            {isCompleted && resume.ats_score !== null && (
                                                <div className="flex gap-2 mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                                                            <span>Content</span>
                                                            <span>{resume.content_score || 0}%</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                                                            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${resume.content_score || 0}%` }} />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                                                            <span>Skills</span>
                                                            <span>{resume.skills_score || 0}%</span>
                                                        </div>
                                                        <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                                                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${resume.skills_score || 0}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 pt-3 border-t border-border">
                                                {isCompleted ? (
                                                    <Link
                                                        href={`/resumes/${resume.resume_id}`}
                                                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-linear-to-r from-orange-500 to-purple-600 text-white text-sm font-medium py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                                                    >
                                                        <IconEye size={16} />
                                                        <span>View Analysis</span>
                                                    </Link>
                                                ) : (
                                                    <div className="flex-1 flex items-center justify-center gap-1.5 bg-background text-gray-400 text-sm font-medium py-2 rounded-lg border border-border">
                                                        <IconClock size={16} className="animate-pulse" />
                                                        <span>Processing...</span>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(resume.resume_id)}
                                                    disabled={deleting === resume.resume_id}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                                                    title="Delete resume"
                                                >
                                                    {deleting === resume.resume_id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent" />
                                                    ) : (
                                                        <IconTrash size={18} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}