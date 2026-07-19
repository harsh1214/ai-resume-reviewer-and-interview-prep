"use client";

import { api } from '@/lib/api';
import { IconAlertCircle, IconBrain, IconChartBar, IconCheck, IconFileText, IconStar, IconTarget, IconX, IconUser, IconMail, IconPhone, IconMapPin, IconBrandLinkedin, IconBriefcase, IconSchool, IconTools, IconRefresh } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AnalysisResults {
    personal_info: {
        name?: string;
        email?: string;
        phone?: string;
        location?: string;
        linkedin?: string;
    };
    summary: string;
    skills: {
        technical: string[];
        soft: string[];
    };
    work_experience: {
        company: string;
        title: string;
        duration: string;
        achievements: string[];
    }[];
    education: {
        institution: string;
        degree: string;
        year: string;
    }[];
    certifications: string[];
    ats_score: {
        overall: number;
        content: number;
        skills: number;
        formatting: number;
        keyword_density: number;
    };
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    keywords: string[];
}

interface ResumeResponse {
    id: number;
    resume_id: string;
    filename: string;
    file_url: string;
    ats_score: number;
    content_score: number;
    skills_score: number;
    formatting_score: number;
    status: string;
    created_at: string;
    updated_at: string;
    analysis_results: AnalysisResults;
}

const hasData = (data: unknown): boolean => {
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'object') {
        return Object.values(data).some(v => {
            if (Array.isArray(v)) return v.length > 0;
            if (typeof v === 'object' && v !== null) return Object.values(v).some(val => val);
            return !!v;
        });
    }
    return !!data;
};

export default function ResumeAnalysisPage() {
    const params = useParams<{ id: string }>();
    const resumeId = params.id;
    const [loading, setLoading] = useState(false);
    // const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ResumeResponse | null>(null);

    useEffect(() => {
        const fetchResume = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/resume/${resumeId}`);
                setResult(res.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch resume');
                setError('Failed to fetch resume');
            } finally {
                setLoading(false);
            }
        };
        fetchResume();
    }, [resumeId]);

    // const handleDownload = async () => {
    //     if (!result) return;
        
    //     try {
    //         setDownloading(true);
    //         const response = await api.get(`/api/resume/${resumeId}/download`, {
    //             responseType: 'blob'
    //         });
            
    //         const blob = new Blob([response.data], { type: 'application/pdf' });
    //         const url = window.URL.createObjectURL(blob);
    //         const link = document.createElement('a');
    //         link.href = url;
    //         link.download = `resume_analysis_${result.filename.replace(/\.[^/.]+$/, '')}.pdf`;
    //         document.body.appendChild(link);
    //         link.click();
    //         link.remove();
    //         window.URL.revokeObjectURL(url);
            
    //         toast.success('Report downloaded successfully!');
    //     } catch (error) {
    //         console.error('Download failed:', error);
    //         toast.error('Failed to download report');
    //     } finally {
    //         setDownloading(false);
    //     }
    // };

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <IconX className="text-red-400" size={40} />
                    </div>
                    <h2 className="lg:text-3xl sm:text-2xl text-xl font-semibold text-white">Error</h2>
                    <p className="text-gray-400 mt-2 sm:text-base text-sm">{error}</p>
                    <Link href="/resumes/upload" className="mt-6 inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white font-semibold py-2.5 px-6 rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                        <IconRefresh size={18} />
                        Try Again
                    </Link>
                </div>
            </div>
        );
    }

    if (!result && !loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                        <IconFileText className="text-yellow-400" size={40} />
                    </div>
                    <h2 className="lg:text-3xl sm:text-2xl text-xl font-semibold text-white">No Analysis Found</h2>
                    <p className="text-gray-400 mt-2 sm:text-base text-sm">Upload a resume to get started</p>
                    <Link href="/resumes/upload" className="mt-6 inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white font-semibold py-2.5 px-6 rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                        <IconFileText size={18} />
                        Analyze New Resume
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
                <div className="text-center">
                    <h2 className="lg:text-3xl sm:text-2xl text-xl text-white">Analyzing Your Resume</h2>
                    <p className="text-gray-400 mt-2 sm:text-base text-sm">Our AI is reviewing your resume...</p>
                </div>
            </div>
        );
    }

    if (result?.status !== 'completed') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                        <IconBrain className="text-yellow-400" size={40} />
                    </div>
                    <h2 className="lg:text-3xl sm:text-2xl text-xl font-semibold text-white">Analysis in Progress</h2>
                    <p className="text-gray-400 mt-2 sm:text-base text-sm">Your resume is being analyzed</p>
                    <Link href="/resumes/upload" className="mt-6 inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white font-semibold py-2.5 px-6 rounded-full hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                        <IconRefresh size={18} />
                        Upload Resume Again
                    </Link>
                </div>
            </div>
        );
    }

    const analysis = result?.analysis_results;
    if (!analysis) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <div className="text-center">
                    <h2 className="lg:text-3xl sm:text-2xl text-xl font-semibold text-white">No Analysis Data</h2>
                    <p className="text-gray-400 mt-2 sm:text-base text-sm">Analysis results are not available</p>
                </div>
            </div>
        );
    }

    const atsScore = result.ats_score ?? analysis.ats_score?.overall ?? 0;
    const contentScore = result.content_score ?? analysis.ats_score?.content ?? 0;
    const skillsScore = result.skills_score ?? analysis.ats_score?.skills ?? 0;
    const formattingScore = result.formatting_score ?? analysis.ats_score?.formatting ?? 0;

    return (
        <div className="bg-background min-h-screen py-8 lg:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Resume Analysis</h1>
                        <p className="text-gray-400 mt-1">{result.filename} • Detailed AI-powered analysis</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {/* <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="inline-flex items-center gap-2 bg-card-bg border border-border text-gray-300 font-semibold py-2.5 px-5 rounded-lg hover:bg-card-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" />
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <IconDownload size={18} />
                                    <span>Download Report</span>
                                </>
                            )}
                        </button> */}
                        <Link href="/resumes/upload" className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-purple-600 text-white font-semibold py-2.5 px-5 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                            <IconFileText size={18} />
                            New Analysis
                        </Link>
                        <Link href="/resumes/" className="inline-flex items-center gap-2 bg-card-bg border border-border text-gray-300 font-semibold py-2.5 px-5 rounded-lg hover:bg-card-hover transition-all">View All</Link>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-card-bg rounded-2xl shadow-lg p-6 border border-border hover:border-orange-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">ATS Score</h3>
                            <div className="p-2 rounded-lg bg-orange-500/20">
                                <IconChartBar className="text-orange-400" size={20} />
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="relative w-32 h-32 shrink-0">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle className="text-border stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="none" />
                                    <circle className="text-orange-500 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="none" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * atsScore) / 100} transform="rotate(-90 50 50)" strokeLinecap="round" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-3xl font-bold text-orange-400">{atsScore}%</span>
                                    <span className="text-xs text-gray-400">Overall</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Content</span>
                                    <span className="text-sm font-medium text-white">{contentScore}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${contentScore}%` }} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Skills</span>
                                    <span className="text-sm font-medium text-white">{skillsScore}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${skillsScore}%` }} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Formatting</span>
                                    <span className="text-sm font-medium text-white">{formattingScore}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${formattingScore}%` }} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 rounded-lg bg-background border border-border">
                            <p className="text-sm text-gray-400 text-center">
                                {atsScore >= 80 ? '🎉 Excellent! Your resume is well-optimized.' : atsScore >= 60 ? '👍 Good! Some improvements needed.' : '📈 Needs significant improvement.'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-card-bg rounded-2xl shadow-lg p-6 border border-border hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Profile Summary</h3>
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <IconUser className="text-purple-400" size={20} />
                            </div>
                        </div>

                        {hasData(analysis.personal_info) && (
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {analysis.personal_info.name && (
                                    <div className="flex items-center gap-2 text-sm col-span-2">
                                        <IconUser size={16} className="text-gray-400" />
                                        <span className="text-gray-300 font-medium">{analysis.personal_info.name}</span>
                                    </div>
                                )}
                                {analysis.personal_info.email && (
                                    <div className="flex items-center gap-2 text-sm col-span-2">
                                        <IconMail size={16} className="text-gray-400" />
                                        <span className="text-gray-300 truncate">{analysis.personal_info.email}</span>
                                    </div>
                                )}
                                {analysis.personal_info.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <IconPhone size={16} className="text-gray-400" />
                                        <span className="text-gray-300">{analysis.personal_info.phone}</span>
                                    </div>
                                )}
                                {analysis.personal_info.location && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <IconMapPin size={16} className="text-gray-400" />
                                        <span className="text-gray-300">{analysis.personal_info.location}</span>
                                    </div>
                                )}
                                {analysis.personal_info.linkedin && analysis.personal_info.linkedin !== 'LinkedIn' && (
                                    <div className="flex items-center gap-2 text-sm col-span-2">
                                        <IconBrandLinkedin size={16} className="text-blue-400" />
                                        <a href={analysis.personal_info.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">
                                            {analysis.personal_info.linkedin.replace(/^https?:\/\//, '')}
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {analysis.summary && (
                            <div className="p-3 rounded-lg bg-background border border-border">
                                <p className="text-sm text-gray-300 leading-relaxed">{analysis.summary}</p>
                            </div>
                        )}

                        {!hasData(analysis.personal_info) && !analysis.summary && (
                            <div className="text-center text-gray-500 py-4">
                                <p className="text-sm">No profile information extracted</p>
                            </div>
                        )}
                    </div>

                    {hasData(analysis.keywords) && (
                        <div className="bg-card-bg rounded-2xl shadow-lg p-6 border border-border hover:border-orange-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Key Keywords</h3>
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <IconTarget className="text-purple-400" size={20} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.keywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="bg-linear-to-r from-orange-500/20 to-purple-600/20 text-orange-400 px-3 py-1.5 rounded-full text-sm font-medium border border-orange-500/30 hover:border-orange-500/60 transition-colors"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                            <p className="mt-3 text-xs text-gray-400">
                                Include these keywords to improve ATS compatibility
                            </p>
                        </div>
                    )}

                    {hasData(analysis.skills) && (
                        <div className="bg-card-bg rounded-2xl shadow-lg p-6 border border-border hover:border-cyan-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Skills</h3>
                                <div className="p-2 rounded-lg bg-cyan-500/20">
                                    <IconTools className="text-cyan-400" size={20} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {analysis.skills?.technical && analysis.skills.technical.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 mb-2">Technical</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {analysis.skills.technical.map((skill, index) => (
                                                <span key={index} className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {analysis.skills?.soft && analysis.skills.soft.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 mb-2">Soft Skills</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {analysis.skills.soft.map((skill, index) => (
                                                <span key={index} className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/20">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {hasData(analysis.certifications) && (
                        <div className="bg-card-bg rounded-2xl shadow-lg p-6 border border-border hover:border-pink-500/30 transition-colors lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Certifications & Awards</h3>
                                <div className="p-2 rounded-lg bg-pink-500/20">
                                    <IconStar className="text-pink-400" size={20} />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.certifications.map((cert, index) => (
                                    <span
                                        key={index}
                                        className="bg-pink-500/10 text-pink-400 px-3 py-1.5 rounded-full text-sm font-medium border border-pink-500/20"
                                    >
                                        🏆 {cert}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasData(analysis.strengths) && (
                        <div className="bg-card-bg rounded-2xl shadow-lg p-6 border border-border hover:border-green-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Strengths</h3>
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <IconCheck className="text-green-400" size={20} />
                                </div>
                            </div>
                            <ul className="space-y-2.5">
                                {analysis.strengths.map((strength, index) => (
                                    <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-start gap-3 p-2 rounded-lg transition-colors">
                                        <IconCheck className="text-green-400 mt-1 shrink-0" size={16} />
                                        <span className="text-gray-300 text-sm">{strength}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {hasData(analysis.weaknesses) && (
                        <div className="bg-card-bg rounded-2xl shadow-lg p-6 border border-border hover:border-yellow-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Areas for Improvement</h3>
                                <div className="p-2 rounded-lg bg-yellow-500/20">
                                    <IconAlertCircle className="text-yellow-400" size={20} />
                                </div>
                            </div>
                            <ul className="space-y-2.5">
                                {analysis.weaknesses.map((weakness, index) => (
                                    <motion.li key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-start gap-3 p-2 rounded-lg transition-colors">
                                        <IconX className="text-red-400 mt-1 shrink-0" size={16} />
                                        <span className="text-gray-300 text-sm">{weakness}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {hasData(analysis.work_experience) && (
                        <div className="lg:col-span-2 bg-card-bg rounded-2xl shadow-lg p-6 border border-border hover:border-blue-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Work Experience</h3>
                                <div className="p-2 rounded-lg bg-blue-500/20">
                                    <IconBriefcase className="text-blue-400" size={20} />
                                </div>
                            </div>
                            <div className="space-y-4">
                                {analysis.work_experience?.map((exp, index) => (
                                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-lg bg-background border border-border hover:border-blue-500/30 transition-colors">
                                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                            <div>
                                                <h4 className="font-semibold text-white">{exp.title}</h4>
                                                <p className="text-sm text-gray-400">{exp.company}</p>
                                            </div>
                                            {exp.duration && (
                                                <span className="text-xs text-gray-500 bg-border px-3 py-1 rounded-full">
                                                    {exp.duration}
                                                </span>
                                            )}
                                        </div>
                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <ul className="mt-2 space-y-1.5">
                                                {exp.achievements.map((achievement, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <span className="text-blue-400 mt-1">•</span>
                                                        {achievement}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasData(analysis.education) && (
                        <div className="lg:col-span-2 bg-card-bg rounded-2xl shadow-lg p-6 border border-border hover:border-green-500/30 transition-colors">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Education</h3>
                                <div className="p-2 rounded-lg bg-green-500/20">
                                    <IconSchool className="text-green-400" size={20} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {analysis.education?.map((edu, index) => (
                                    <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-lg bg-background border border-border hover:border-green-500/30 transition-colors">
                                        <h4 className="font-semibold text-white">{edu.institution}</h4>
                                        <p className="text-sm text-gray-400">{edu.degree}</p>
                                        {edu.year && (
                                            <span className="text-xs text-gray-500">{edu.year}</span>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasData(analysis.suggestions) && (
                        <div className="lg:col-span-2 bg-linear-to-r from-orange-900/20 to-purple-900/20 rounded-2xl shadow-lg p-6 border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">AI Suggestions</h3>
                                <div className="p-2 rounded-lg bg-purple-500/20">
                                    <IconBrain className="text-purple-400" size={20} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {analysis.suggestions.map((suggestion, index) => (
                                    <motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="flex items-start gap-3 bg-background p-4 rounded-lg border border-border hover:border-orange-500/30 transition-colors">
                                        <div className="p-1 rounded-full bg-yellow-500/20 shrink-0 mt-0.5">
                                            <IconStar className="text-yellow-400" size={14} />
                                        </div>
                                        <span className="text-sm text-gray-300 leading-relaxed">{suggestion}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}