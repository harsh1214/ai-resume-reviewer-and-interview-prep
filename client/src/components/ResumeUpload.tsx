'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    IconUpload,
    IconFileDelta,
    IconFileWord,
    IconX,
    IconLoader2,
} from '@tabler/icons-react'

interface ResumeUploadProps {
    onUpload: (file: File) => void
}

export default function ResumeUpload({ onUpload }: ResumeUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (
                file.type === 'application/pdf' ||
                file.type ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                setFile(file)
            } else {
                alert('Please upload a PDF or DOCX file')
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (
                file.type === 'application/pdf' ||
                file.type ===
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                setFile(file)
            } else {
                alert('Please upload a PDF or DOCX file')
            }
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setUploading(false)
        onUpload(file)
        setFile(null)
    }

    const removeFile = () => {
        setFile(null)
    }

    return (
        <div className="w-full">
            {!file ? (
                <div
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragActive
                            ? 'border-orange-500 bg-orange-500/10 glow-orange'
                            : 'border-border hover:border-orange-500/50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-linear-to-r from-orange-500/20 to-purple-600/20 rounded-full flex items-center justify-center text-4xl text-orange-400 mb-4">
                            <IconUpload size={32} />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Upload Your Resume
                        </h3>
                        <p className="text-gray-200 mb-4">
                            Drag & drop or click to upload (PDF or DOCX)
                        </p>
                        <label className="bg-linear-to-r from-orange-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all cursor-pointer">
                            Choose File
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleChange}
                                accept=".pdf,.docx"
                            />
                        </label>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card-bg rounded-2xl shadow-lg p-6 border border-border"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {file.type === 'application/pdf' ? (
                                <IconFileDelta className="text-red-400 text-4xl" size={40} />
                            ) : (
                                <IconFileWord className="text-orange-400 text-4xl" size={40} />
                            )}
                            <div>
                                <h4 className="font-semibold text-white">{file.name}</h4>
                                <p className="text-sm text-gray-400">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={removeFile}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                            <IconX size={24} />
                        </button>
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className={`w-full mt-4 py-3 rounded-lg text-white font-semibold transition-all flex items-center justify-center space-x-2 ${uploading
                                ? 'bg-gray-700 cursor-not-allowed'
                                : 'bg-linear-to-r from-orange-500 to-purple-600 hover:shadow-lg hover:shadow-orange-500/25'
                            }`}
                    >
                        {uploading ? (
                            <>
                                <IconLoader2 className="animate-spin" size={20} />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <span>Analyze Resume</span>
                        )}
                    </button>
                </motion.div>
            )}
        </div>
    )
}