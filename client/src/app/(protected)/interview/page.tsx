'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    IconMessageChatbot,
    IconSend,
    IconMicrophone,
    IconVolume3,
    IconBrain,
    IconList,
    IconArrowRight,
} from '@tabler/icons-react'

interface Message {
    id: number
    type: 'user' | 'ai'
    content: string
}

interface Question {
    id: number
    question: string
    category: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
}

export default function InterviewPractice() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            type: 'ai',
            content: "Hi! I'm your AI interview coach. I'll help you practice for your upcoming interviews. Let's start with a simple question: Tell me about yourself.",
        },
    ])
    const [input, setInput] = useState('')
    const [isRecording, setIsRecording] = useState(false)
    const [selectedRole, setSelectedRole] = useState('Software Engineer')

    const suggestedQuestions: Question[] = [
        {
            id: 1,
            question: 'Tell me about a challenging project you worked on.',
            category: 'Experience',
            difficulty: 'Medium',
        },
        {
            id: 2,
            question: 'How do you handle conflict in a team?',
            category: 'Behavioral',
            difficulty: 'Hard',
        },
        {
            id: 3,
            question: 'What are your greatest strengths?',
            category: 'General',
            difficulty: 'Easy',
        },
        {
            id: 4,
            question: 'Where do you see yourself in 5 years?',
            category: 'Career Goals',
            difficulty: 'Medium',
        },
    ]

    const handleSend = () => {
        if (!input.trim()) return

        setMessages([
            ...messages,
            { id: messages.length + 1, type: 'user', content: input },
        ])
        setInput('')

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: prev.length + 1,
                    type: 'ai',
                    content:
                        "That's a great answer! Let's dive deeper. Can you provide a specific example from your experience that demonstrates this skill?",
                },
            ])
        }, 1000)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const useSuggestedQuestion = (question: string) => {
        setInput(question)
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
                            <h1 className="text-3xl font-bold text-white">
                                Interview Practice
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Practice with AI and improve your interview skills
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <label className="text-sm text-gray-400">Role:</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="bg-card-bg border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                            >
                                <option>Software Engineer</option>
                                <option>Data Scientist</option>
                                <option>Product Manager</option>
                                <option>UX Designer</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Chat Area */}
                        <div className="lg:col-span-2 bg-card-bg rounded-2xl shadow-lg overflow-hidden border border-border">
                            <div className="p-4 bg-linear-to-r from-orange-500 to-purple-600">
                                <div className="flex items-center space-x-3 text-white">
                                    <IconMessageChatbot size={24} />
                                    <span className="font-semibold">AI Interview Coach</span>
                                    <span className="text-sm opacity-80">• Online</span>
                                </div>
                            </div>

                            <div className="h-96 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        <div
                                            className={`max-w-3/4 p-4 rounded-lg ${message.type === 'user'
                                                    ? 'bg-linear-to-r from-orange-500 to-purple-600 text-white'
                                                    : 'bg-background text-gray-200 border border-border'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-border">
                                <div className="flex items-center space-x-2">
                                    <button
                                        className={`p-2 rounded-lg transition-colors ${isRecording
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-background text-gray-400 hover:bg-border'
                                            }`}
                                        onClick={() => setIsRecording(!isRecording)}
                                    >
                                        <IconMicrophone size={20} />
                                    </button>
                                    <button className="p-2 rounded-lg bg-background text-gray-400 hover:bg-border transition-colors">
                                        <IconVolume3 size={20} />
                                    </button>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your answer..."
                                        className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="bg-linear-to-r from-orange-500 to-purple-600 text-white p-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                                    >
                                        <IconSend size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Suggested Questions */}
                            <div className="bg-card-bg rounded-2xl shadow-lg p-6 border border-border">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-white">
                                        Suggested Questions
                                    </h3>
                                    <IconList className="text-gray-400" size={20} />
                                </div>
                                <div className="space-y-3">
                                    {suggestedQuestions.map((q) => (
                                        <button
                                            key={q.id}
                                            onClick={() => useSuggestedQuestion(q.question)}
                                            className="w-full text-left p-3 rounded-lg hover:bg-background transition-colors border border-border"
                                        >
                                            <div className="flex items-start justify-between">
                                                <span className="text-sm text-gray-300">
                                                    {q.question}
                                                </span>
                                                <IconArrowRight className="text-gray-500" size={16} />
                                            </div>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className="text-xs text-gray-400">
                                                    {q.category}
                                                </span>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${q.difficulty === 'Easy'
                                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                            : q.difficulty === 'Medium'
                                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                        }`}
                                                >
                                                    {q.difficulty}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="bg-linear-to-r from-purple-900/20 to-pink-900/20 rounded-2xl shadow-lg p-6 border border-border">
                                <div className="flex items-center space-x-2 mb-4">
                                    <IconBrain className="text-purple-400" size={24} />
                                    <h3 className="font-semibold text-white">Interview Tips</h3>
                                </div>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-purple-400">•</span>
                                        <span className="text-gray-300">Use the STAR method for behavioral questions</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-purple-400">•</span>
                                        <span className="text-gray-300">Practice speaking clearly and confidently</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-purple-400">•</span>
                                        <span className="text-gray-300">Research the company before your interview</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-purple-400">•</span>
                                        <span className="text-gray-300">Prepare questions to ask the interviewer</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}