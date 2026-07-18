'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    // IconUpload,
    IconFileText,
    IconChartBar,
    IconCheck,
    IconX,
    IconAlertCircle,
    IconBrain,
    IconStar,
    IconTarget,
} from '@tabler/icons-react'
import ResumeUpload from '@/components/ResumeUpload'

interface AnalysisResult {
    atsScore: number
    strengths: string[]
    weaknesses: string[]
    suggestions: string[]
    keywords: string[]
}

export default function Resumes() {
    const [analyzing, setAnalyzing] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)

    const handleUpload = async (
        // file: File
        ) => {
        setAnalyzing(true)
        await new Promise((resolve) => setTimeout(resolve, 3000))
        setAnalyzing(false)
        setResult({
            atsScore: 78,
            strengths: [
                'Strong work experience section',
                'Good use of action verbs',
                'Clear career progression',
            ],
            weaknesses: [
                'Missing keywords for ATS',
                'Length could be optimized',
                'Summary section needs improvement',
            ],
            suggestions: [
                'Add more industry-specific keywords',
                'Quantify achievements with numbers',
                'Improve formatting for better readability',
            ],
            keywords: ['React', 'TypeScript', 'AWS', 'Docker', 'CI/CD'],
        })
    }

    if (analyzing) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                    <h2 className="text-2xl font-semibold text-white">
                        Analyzing Your Resume
                    </h2>
                    <p className="text-gray-400 mt-2">
                        Our AI is reviewing your resume...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background flex items-center justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:py-20 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Resume Analysis
                        </h1>
                        <p className="text-xl text-gray-400">
                            Upload your resume for AI-powered analysis
                        </p>
                    </div>

                    {!result ? (
                        <div className="max-w-3xl mx-auto">
                            <ResumeUpload onUpload={handleUpload} />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                        >
                            {/* Score Card */}
                            <div className="bg-card-bg rounded-2xl shadow-lg p-8 border border-border">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-white">ATS Score</h3>
                                    <IconChartBar className="text-orange-400" size={24} />
                                </div>
                                <div className="relative w-48 h-48 mx-auto mb-6">
                                    <svg className="w-full h-full" viewBox="0 0 100 100">
                                        <circle
                                            className="text-border stroke-current"
                                            strokeWidth="8"
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                        />
                                        <circle
                                            className="text-orange-500 stroke-current"
                                            strokeWidth="8"
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="none"
                                            strokeDasharray={251.2}
                                            strokeDashoffset={251.2 - (251.2 * result.atsScore) / 100}
                                            transform="rotate(-90 50 50)"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-orange-400">
                                            {result.atsScore}%
                                        </span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-400">
                                        {result.atsScore >= 80
                                            ? 'Excellent! Your resume is well-optimized.'
                                            : result.atsScore >= 60
                                                ? 'Good! Some improvements needed.'
                                                : 'Needs significant improvement.'}
                                    </p>
                                </div>
                            </div>

                            {/* Keywords */}
                            <div className="bg-card-bg rounded-2xl shadow-lg p-8 border border-border">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-white">Key Keywords</h3>
                                    <IconTarget className="text-purple-400" size={24} />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {result.keywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="bg-linear-to-r from-orange-500/20 to-purple-600/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium border border-orange-500/30"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-4 text-sm text-gray-400">
                                    Include these keywords to improve ATS compatibility
                                </p>
                            </div>

                            {/* Strengths */}
                            <div className="bg-card-bg rounded-2xl shadow-lg p-8 border border-border">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-white">Strengths</h3>
                                    <IconCheck className="text-green-400" size={24} />
                                </div>
                                <ul className="space-y-3">
                                    {result.strengths.map((strength, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <IconCheck className="text-green-400 mt-1" size={18} />
                                            <span className="text-gray-300">{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Weaknesses */}
                            <div className="bg-card-bg rounded-2xl shadow-lg p-8 border border-border">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-white">Areas for Improvement</h3>
                                    <IconAlertCircle className="text-yellow-400" size={24} />
                                </div>
                                <ul className="space-y-3">
                                    {result.weaknesses.map((weakness, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <IconX className="text-red-400 mt-1" size={18} />
                                            <span className="text-gray-300">{weakness}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Suggestions */}
                            <div className="lg:col-span-2 bg-linear-to-r from-orange-900/20 to-purple-900/20 rounded-2xl shadow-lg p-8 border border-border">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-white">AI Suggestions</h3>
                                    <IconBrain className="text-purple-400" size={24} />
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {result.suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start space-x-3 bg-background p-4 rounded-lg border border-border"
                                        >
                                            <IconStar className="text-yellow-400 mt-1" size={18} />
                                            <span className="text-sm text-gray-300">{suggestion}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="lg:col-span-2 flex justify-center space-x-4 mt-4">
                                <button className="bg-linear-to-r from-orange-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all font-semibold flex items-center space-x-2">
                                    <IconFileText size={18} />
                                    <span>Generate Interview Questions</span>
                                </button>
                                <button className="bg-border text-gray-300 px-8 py-3 rounded-lg hover:bg-[#3a4050] transition-colors font-semibold">
                                    Download Report
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}