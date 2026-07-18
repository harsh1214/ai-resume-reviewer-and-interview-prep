'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconMail, IconLock } from '@tabler/icons-react'
import Image from 'next/image'
import AuthImage from "@/assets/auth.jpg"
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Must contain uppercase, lowercase and number"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
    const router = useRouter();
    const loginStore = useAuthStore((state) => state.login);
    const [error, setError] = useState({
        isActive: false,
        message: "",
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setError({ isActive: false, message: "" });
            setLoading(true);
            const payload = {
                email: data.email,
                password: data.password,
            };
            const res = await api.post("/api/auth/login", payload);
            const { access_token, refresh_token } = res.data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            loginStore();
            toast.success("Login successful");
            router.replace("/dashboard");
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                toast.error("Login failed");
                setError({ isActive: true, message: e?.response?.data?.detail });
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-background relative z-5">
            <div className="absolute inset-0 opacity-40 z-5 max-lg:hidden" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(217,119,6,0.7), transparent 40%), radial-gradient(circle at 80% 70%, rgba(6,182,212,0.2), transparent 45%)' }} />
            <div className="absolute inset-0 opacity-40 z-5  bg-linear-to-b from-[#1a1025] via-[#170f22] to-[#0c0a12]" />
            <Image src={AuthImage} alt="Background" loading="eager" className="absolute z-5 top-0 left-0 w-1/2 max-w-1/2 h-full max-lg:hidden object-cover object-center" />
            <div className="w-full relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 lg:py-20 py-12">
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-32">
                    <div className="hidden lg:flex relative overflow-hidden">
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
                                <p className="text-gray-400 mt-2">Sign in to your account</p>
                            </div>
                            {
                                error.isActive && (
                                    <div className="text-red-500 text-sm pb-6">{error.message}</div>
                                )
                            }
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <label className="block text-sm mb-2 text-gray-300">Email</label>
                                    <div className="relative">
                                        <IconMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                        <input type="email" {...register("email")} placeholder="you@example.com" className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                    {errors.email && (<div className="text-red-500 text-sm pb-2 px-2">{errors.email.message}</div>)}
                                </div>
                                <div>
                                    <label className="block text-sm mb-2 text-gray-300">Password</label>
                                    <div className="relative">
                                        <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                        <input type="password" {...register("password")} placeholder="••••••••" className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                    {errors.password && (<div className="text-red-500 text-sm pb-2 px-2">{errors.password.message}</div>)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <Link href="/forgot-password" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <button type="submit" disabled={loading || isSubmitting} className="w-full bg-linear-to-r from-orange-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all">
                                    {loading ? "Signing In..." : "Sign In"}
                                </button>
                            </form>
                            <p className="mt-8 text-center text-sm text-gray-400">
                                Don&apos;t have an account?{' '}
                                <Link href="/register" className="font-medium text-orange-400 hover:text-orange-300 transition-colors">Sign up now</Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}