'use client'

import { useState } from 'react'
import { motion } from 'framer-motion';
import ResumeUpload from '@/components/ResumeUpload'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';


export default function Resumes() {

    const [analyzing, setAnalyzing] = useState(false);
    const router = useRouter();
    const [error, setError] = useState(false);

    const handleUpload = async (resumeId: string) => {
        setAnalyzing(true)
        try {
            const res = await api.post(`/api/resume/analyze/${resumeId}`)
            const data = res.data;
            if ( data.status === 'success' ) {
                router.push(`/resumes/${resumeId}`);
            }
        }
        catch (error) {
            console.error(error);
            toast.error('Failed to analyze resume');
            setError(true);
        }
        finally {
            setAnalyzing(false)
        }
    }

    if (error) {
        return (
            <div className="min-h-100 bg-background flex items-center justify-center py-12">
                <div className="text-center">
                    <h2 className="text-3xl font-semibold text-white">Failed to analyze resume</h2>
                    <p className="text-gray-400 mt-2">Please try again.</p>
                    <Link href="/resumes/upload" className="mt-4 inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out">Try Again</Link>
                </div>
            </div>
        )
    }

    if (analyzing) {
        return (
            <div className="min-h-100 bg-background flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                    <h2 className="text-3xl font-semibold text-white">Analyzing Your Resume</h2>
                    <p className="text-gray-400 mt-2">Our AI is reviewing your resume...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background flex items-center justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:py-20 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-white">Resume Analysis</h1>
                        <p className="text-gray-400 mt-2">Upload your resume for AI-powered analysis</p>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <ResumeUpload onUpload={handleUpload} />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}