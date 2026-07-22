'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { IconMenu2, IconX, IconUser, IconLogout, IconLogin, IconUserPlus, IconHome, IconLayoutDashboard, IconFileAnalytics, IconMessageChatbot, IconHistory } from '@tabler/icons-react'
import { useAuthStore } from '@/stores/auth-store'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { isLoggedIn, logout: logoutStore } = useAuthStore();
    const router = useRouter()

    const navLinks = [
        { href: '/', label: 'Home', icon: IconHome },
        { href: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
        { href: '/resumes', label: 'Resumes', icon: IconFileAnalytics },
        { href: '/interview', label: 'Interview Practice', icon: IconMessageChatbot }
    ]

    const isActive = (path: string) => pathname === path

    const logout = async () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        logoutStore();
        router.push('/login')
    };

    return (
        <nav className="bg-background/95 backdrop-blur-lg border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold gradient-text">AI Resume</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`${isActive(link.href)
                                        ? 'text-orange-400 border-b-2 border-orange-400'
                                        : 'text-gray-400 hover:text-orange-400'
                                        } px-3 py-2 text-sm font-medium transition-colors flex items-center space-x-1`}
                                >
                                    <Icon size={18} />
                                    <span>{link.label}</span>
                                </Link>
                            )
                        })}

                        {isLoggedIn ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/profile" className="text-gray-400 hover:text-orange-400 transition-colors">
                                    <IconUser size={22} />
                                </Link>
                                <button onClick={logout} className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                                    <IconLogout size={22} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login" className="bg-linear-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center space-x-2">
                                    <IconLogin size={22} />
                                    <span>Login</span>
                                </Link>
                                <Link href="/register" className="bg-linear-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/25 transition-all flex items-center space-x-2">
                                    <IconUserPlus size={18} />
                                    <span>Sign Up</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-orange-400 p-2 transition-colors"
                        >
                            {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="lg:hidden bg-card-bg border-t border-border">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`${isActive(link.href)
                                        ? 'bg-linear-to-r from-orange-500/20 to-purple-600/20 text-orange-400'
                                        : 'text-gray-400 hover:bg-linear-to-r hover:from-orange-500/10 hover:to-purple-600/10 hover:text-orange-400'
                                        } px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span>{link.label}</span>
                                </Link>
                            )
                        })}
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-linear-to-r hover:from-orange-500/10 hover:to-purple-600/10 hover:text-orange-400 flex items-center space-x-2 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <IconUser size={20} />
                                    <span>Profile</span>
                                </Link>
                                <button className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10 flex items-center space-x-2 transition-colors">
                                    <IconLogout size={20} />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:bg-linear-to-r hover:from-orange-500/10 hover:to-purple-600/10 hover:text-orange-400 flex items-center space-x-2 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <IconLogin size={20} />
                                    <span>Sign In</span>
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-3 py-2 rounded-md text-base font-medium bg-linear-to-r from-orange-500 to-purple-600 text-white hover:shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2 transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <IconUserPlus size={20} />
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}