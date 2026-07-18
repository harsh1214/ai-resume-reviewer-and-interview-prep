'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    IconUpload,
    IconChartBar,
    IconMessageChatbot,
    IconShieldLock,
    IconRocket,
    IconBrain,
    IconFileText,
    IconTarget,
} from '@tabler/icons-react'
import FeatureCard from '@/components/FeatureCard'
import ResumeUpload from '@/components/ResumeUpload'

export default function Landing() {
    const handleUpload = (file: File) => {
        console.log('File uploaded:', file)
    }

    const features = [
        {
            icon: <IconUpload size={28} />,
            title: 'Upload & Analyze',
            description:
                'Upload your resume in PDF or DOCX format for instant AI-powered analysis.',
            color: 'bg-linear-to-r from-orange-500/20 to-orange-400/20 text-orange-400',
        },
        {
            icon: <IconChartBar size={28} />,
            title: 'ATS Score',
            description:
                "Get your resume's ATS compatibility score and improvement suggestions.",
            color: 'bg-linear-to-r from-green-500/20 to-emerald-400/20 text-green-400',
        },
        {
            icon: <IconBrain size={28} />,
            title: 'AI Analysis',
            description:
                'Receive detailed strengths, weaknesses, and improvement recommendations.',
            color: 'bg-linear-to-r from-purple-500/20 to-purple-400/20 text-purple-400',
        },
        {
            icon: <IconMessageChatbot size={28} />,
            title: 'Interview Practice',
            description:
                'Generate role-specific interview questions and practice with AI.',
            color: 'bg-linear-to-r from-cyan-500/20 to-cyan-400/20 text-cyan-400',
        },
        {
            icon: <IconShieldLock size={28} />,
            title: 'Secure & Private',
            description: 'Your data is encrypted and secure. We respect your privacy.',
            color: 'bg-linear-to-r from-red-500/20 to-red-400/20 text-red-400',
        },
        {
            icon: <IconRocket size={28} />,
            title: 'Fast Results',
            description:
                'Get your resume analysis and interview questions in seconds.',
            color: 'bg-linear-to-r from-indigo-500/20 to-indigo-400/20 text-indigo-400',
        },
    ]

    const steps = [
        {
            step: '1',
            title: 'Upload Resume',
            description:
                'Upload your resume in PDF or DOCX format. Our AI will analyze it instantly.',
            icon: <IconFileText size={40} />,
        },
        {
            step: '2',
            title: 'Get Analysis',
            description:
                'Receive detailed feedback on strengths, weaknesses, ATS score, and improvements.',
            icon: <IconChartBar size={40} />,
        },
        {
            step: '3',
            title: 'Practice Interviews',
            description:
                'Generate role-specific questions and practice with our AI interview coach.',
            icon: <IconTarget size={40} />,
        },
    ]

    return (
        <>
            {/* Hero Section */}
            <section className="gradient-bg text-white py-20 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-orange-400 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-64 h-64 bg-purple-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-2000"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                                AI Resume Reviewer & {" "}
                                <span className="text-yellow-300">Interview Coach</span>
                            </h1>
                            <p className="text-xl opacity-90 mb-8">
                                Upload your resume and get AI-powered analysis, ATS score, and
                                personalized interview preparation.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/analysis"
                                    className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-white/20 transition-all transform hover:scale-105"
                                >
                                    Get Started Free
                                </Link>
                                <Link
                                    href="#features"
                                    className="bg-linear-to-r from-orange-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all cursor-pointer hover:scale-105">
                                    Learn More
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                        >
                            <ResumeUpload onUpload={handleUpload} />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Why Choose <span className="gradient-text">AI Resume Reviewer?</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                            Get comprehensive AI-powered tools to boost your job application
                            success.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-[#0f1420]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-gray-400">
                            Three simple steps to improve your resume and ace your interviews
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="text-center"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 bg-linear-to-r from-orange-500/20 to-purple-600/20 rounded-full flex items-center justify-center text-4xl text-orange-400 mx-auto mb-6">
                                        {item.icon}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-linear-to-r from-orange-500/30 to-purple-600/30">
                                            <div className="absolute right-0 -top-1.5 w-3 h-3 bg-orange-400 rotate-45"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="inline-block bg-linear-to-r from-orange-500/20 to-purple-600/20 text-orange-400 px-3 py-1 rounded-full text-sm font-semibold mb-2">
                                    Step {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="gradient-bg text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Ace Your Interview?
                        </h2>
                        <p className="text-xl opacity-90 mb-8">
                            Join thousands of job seekers who improved their resumes and
                            landed their dream jobs.
                        </p>
                        <Link
                            href="/register"
                            className="bg-white text-orange-600 px-10 py-4 rounded-lg font-semibold text-lg hover:shadow-xl hover:shadow-white/20 transition-all transform hover:scale-105 inline-block"
                        >
                            Start Your Journey
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    )
}