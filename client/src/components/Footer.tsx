import Link from 'next/link'
import {
    IconBrandGithub,
    IconBrandTwitter,
    IconBrandLinkedin,
    IconBrandYoutube,
} from '@tabler/icons-react'

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border text-gray-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 lg:py-20 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold gradient-text mb-4">AI Resume</h3>
                        <p className="text-gray-400 text-sm">
                            AI-powered resume analysis and interview coaching to help you land
                            your dream job.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-orange-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-gray-400 hover:text-orange-400 transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/resumes" className="text-gray-400 hover:text-orange-400 transition-colors">
                                    Resumes
                                </Link>
                            </li>
                            <li>
                                <Link href="/interview" className="text-gray-400 hover:text-orange-400 transition-colors">
                                    Interview Practice
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Features</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-400">ATS Score</li>
                            <li className="text-gray-400">Strengths Analysis</li>
                            <li className="text-gray-400">Interview Questions</li>
                            <li className="text-gray-400">Mock Interview</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-white">Connect</h4>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-orange-400 transition-colors"
                                aria-label="GitHub"
                            >
                                <IconBrandGithub size={28} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-orange-400 transition-colors"
                                aria-label="Twitter"
                            >
                                <IconBrandTwitter size={28} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-orange-400 transition-colors"
                                aria-label="LinkedIn"
                            >
                                <IconBrandLinkedin size={28} />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-orange-400 transition-colors"
                                aria-label="YouTube"
                            >
                                <IconBrandYoutube size={28} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; 2026 AI Resume Reviewer. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}