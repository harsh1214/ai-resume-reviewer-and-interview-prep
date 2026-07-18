'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    IconSearch,
    // IconFilter,
    IconCalendar,
    IconFileText,
    IconStar,
    IconChevronDown,
} from '@tabler/icons-react'

interface HistoryItem {
    id: number
    title: string
    date: string
    type: 'resume' | 'interview'
    score: string
    status: 'Excellent' | 'Good' | 'Needs Improvement'
}

export default function History() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('All')

    const historyData: HistoryItem[] = [
        {
            id: 1,
            title: 'Software Engineer Resume Analysis',
            date: '2026-01-15',
            type: 'resume',
            score: '85%',
            status: 'Excellent',
        },
        {
            id: 2,
            title: 'Data Scientist Interview Practice',
            date: '2026-01-14',
            type: 'interview',
            score: 'N/A',
            status: 'Good',
        },
        {
            id: 3,
            title: 'Product Manager Resume Analysis',
            date: '2026-01-12',
            type: 'resume',
            score: '72%',
            status: 'Good',
        },
        {
            id: 4,
            title: 'UX Designer Resume Analysis',
            date: '2026-01-10',
            type: 'resume',
            score: '65%',
            status: 'Needs Improvement',
        },
        {
            id: 5,
            title: 'React Developer Interview Practice',
            date: '2026-01-09',
            type: 'interview',
            score: 'N/A',
            status: 'Excellent',
        },
    ]

    const filteredData = historyData.filter((item) => {
        const matchesSearch = item.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        const matchesFilter = filter === 'All' || item.type === filter.toLowerCase()
        return matchesSearch && matchesFilter
    })

    const getStatusColor = (status: string) => {
        const colors = {
            Excellent: 'bg-linear-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30',
            Good: 'bg-linear-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
            'Needs Improvement': 'bg-linear-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30',
        }
        return colors[status as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }

    return (
        <div className="bg-background flex items-center justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:py-20 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-white">History</h1>
                            <p className="text-gray-400 mt-1">
                                View all your past resume analyses and interview sessions
                            </p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="bg-card-bg rounded-xl shadow-md p-4 mb-8 border border-border">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <IconSearch
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search history..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setFilter('All')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'All'
                                            ? 'bg-linear-to-r from-orange-500 to-purple-600 text-white'
                                            : 'bg-background text-gray-400 hover:bg-border'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    onClick={() => setFilter('Resume')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'Resume'
                                            ? 'bg-linear-to-r from-orange-500 to-purple-600 text-white'
                                            : 'bg-background text-gray-400 hover:bg-border'
                                        }`}
                                >
                                    Resumes
                                </button>
                                <button
                                    onClick={() => setFilter('Interview')}
                                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'Interview'
                                            ? 'bg-linear-to-r from-orange-500 to-purple-600 text-white'
                                            : 'bg-background text-gray-400 hover:bg-border'
                                        }`}
                                >
                                    Interviews
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* History List */}
                    <div className="bg-card-bg rounded-2xl shadow-lg overflow-hidden border border-border">
                        <div className="divide-y divide-border">
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="p-6 hover:bg-background transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start space-x-4">
                                                <div
                                                    className={`p-2 rounded-lg ${item.type === 'resume'
                                                            ? 'bg-linear-to-r from-orange-500/20 to-orange-400/20 text-orange-400'
                                                            : 'bg-linear-to-r from-purple-500/20 to-purple-400/20 text-purple-400'
                                                        }`}
                                                >
                                                    <IconFileText size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-white">
                                                        {item.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <div className="flex items-center text-sm text-gray-400">
                                                            <IconCalendar size={14} className="mr-1" />
                                                            {item.date}
                                                        </div>
                                                        <span className="text-sm text-gray-400">
                                                            {item.type === 'resume' ? 'Resume Analysis' : 'Interview Practice'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                {item.score !== 'N/A' && (
                                                    <div className="flex items-center space-x-1">
                                                        <IconStar
                                                            className="text-yellow-400"
                                                            size={16}
                                                            fill="#FCD34D"
                                                        />
                                                        <span className="font-semibold text-white">{item.score}</span>
                                                    </div>
                                                )}
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                                        item.status
                                                    )}`}
                                                >
                                                    {item.status}
                                                </span>
                                                <button className="text-gray-400 hover:text-gray-300">
                                                    <IconChevronDown size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-400">No results found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}