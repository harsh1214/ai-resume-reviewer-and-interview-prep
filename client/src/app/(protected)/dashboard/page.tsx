'use client'

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
} from '@tabler/icons-react'
import StatCard from '@/components/StatCard'
import ReportCard from '@/components/ReportCard'

export default function Dashboard() {
    const stats = [
        {
            icon: <IconFiles size={24} />,
            label: 'Total Analyses',
            value: '24',
            color: 'bg-linear-to-r from-orange-500/20 to-orange-400/20 text-orange-400',
        },
        {
            icon: <IconChartBar size={24} />,
            label: 'Average ATS Score',
            value: '78%',
            color: 'bg-linear-to-r from-green-500/20 to-emerald-400/20 text-green-400',
        },
        {
            icon: <IconBrain size={24} />,
            label: 'Interview Sessions',
            value: '12',
            color: 'bg-linear-to-r from-purple-500/20 to-purple-400/20 text-purple-400',
        },
    ]

    const recentReports = [
        {
            title: 'Software Engineer Resume',
            date: '2026-01-15',
            score: '85%',
            status: 'Excellent' as const,
        },
        {
            title: 'Data Scientist Resume',
            date: '2026-01-12',
            score: '72%',
            status: 'Good' as const,
        },
        {
            title: 'Product Manager Resume',
            date: '2026-01-10',
            score: '65%',
            status: 'Needs Improvement' as const,
        },
    ]

    return (
        <div className="bg-background flex items-center justify-center">
            <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8 lg:py-20 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                            <p className="text-gray-400 mt-2">Welcome back, John!</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href="/resumes/upload"
                                className="bg-linear-to-r from-orange-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center space-x-2"
                            >
                                <IconUpload size={18} />
                                <span>New Analysis</span>
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <StatCard {...stat} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link
                            href="/analysis"
                            className="bg-linear-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-orange-500/25 transition-all hover:scale-105 transform"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">Upload Resume</h3>
                                    <p className="text-sm opacity-80">Get AI analysis</p>
                                </div>
                                <IconFileText size={32} />
                            </div>
                        </Link>

                        <Link
                            href="/interview"
                            className="bg-linear-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all hover:scale-105 transform"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">Mock Interview</h3>
                                    <p className="text-sm opacity-80">Practice with AI</p>
                                </div>
                                <IconMessageChatbot size={32} />
                            </div>
                        </Link>

                        <Link
                            href="/history"
                            className="bg-linear-to-r from-cyan-500 to-cyan-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all hover:scale-105 transform"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">View History</h3>
                                    <p className="text-sm opacity-80">Past analyses</p>
                                </div>
                                <IconHistory size={32} />
                            </div>
                        </Link>
                    </div>

                    {/* Recent Reports */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Recent Reports</h2>
                            <Link href="/history" className="text-orange-400 hover:text-orange-300 transition-colors">
                                View All →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentReports.map((report, index) => (
                                <ReportCard key={index} {...report} />
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}