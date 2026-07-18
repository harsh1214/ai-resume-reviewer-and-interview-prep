'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api } from "@/lib/api"
import { motion } from 'framer-motion'
import { IconUser, IconMail, IconLock, IconMapPin, IconPhone, IconAt } from '@tabler/icons-react'
import Image from 'next/image'
import AuthImage from "@/assets/auth.jpg"
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export const registerSchema = z.object({
    full_name: z.string().min(1, "Full name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    location: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Must contain uppercase, lowercase and number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
);

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });
    const router = useRouter();
    const [error, setError] = useState({
        isActive: false,
        message: "",
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setError({ isActive: false, message: "" });
            setLoading(true);
            const payload = {
                email: data.email,
                username: data.username,
                full_name: data.full_name,
                phone: data.phone,
                location: data.location,
                password: data.password,
            };
            const res = await api.post("/api/auth/register", payload);
            const { access_token, refresh_token } = res.data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            toast.success("Registration successful");
            router.replace("/resumes/upload");
        } 
        catch (e) {
            if (axios.isAxiosError(e)){
                toast.error("Registration failed");
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
                                <h2 className="text-3xl font-bold gradient-text">Create Account</h2>
                                <p className="text-gray-400 mt-2">Start your journey to career success</p>
                            </div>
                            {
                                error.isActive && (
                                    <div className="text-red-500 text-sm pb-6">{error.message}</div>
                                )
                            }
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm mb-2 text-gray-300">Full Name</label>
                                        <div className="relative">
                                            <IconUser size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                            <input type="text" {...register("full_name")} placeholder="Your Full Name" className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                        { errors.full_name && ( <div className="text-red-500 text-sm py-2 px-2">{errors.full_name.message}</div> ) }
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-2 text-gray-300">Username</label>
                                        <div className="relative">
                                            <IconAt size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                            <input type="text" {...register("username")} placeholder="eg. johndoe_16" className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                        { errors.username && ( <div className="text-red-500 text-sm py-2 px-2">{errors.username.message}</div> ) }
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm mb-2 text-gray-300">Email</label>
                                    <div className="relative">
                                        <IconMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                        <input type="email" {...register("email")} placeholder="you@example.com" className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                                    </div>
                                    { errors.email && ( <div className="text-red-500 text-sm py-2 px-2">{errors.email.message}</div> ) }
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm mb-2 text-gray-300">Phone</label>
                                        <div className="relative">
                                            <IconPhone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                            <input type="text" {...register("phone")} placeholder="+91 9876543210" className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                        { errors.phone && ( <div className="text-red-500 text-sm py-2 px-2">{errors.phone.message}</div> ) }
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-2 text-gray-300">Location</label>
                                        <div className="relative">
                                            <IconMapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                            <input type="text" {...register("location")} placeholder="Mumbai, India" className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                        { errors.location && ( <div className="text-red-500 text-sm py-2 px-2">{errors.location.message}</div> ) }
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm mb-2 text-gray-300">Password</label>
                                        <div className="relative">
                                            <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                            <input type="password" {...register("password")} placeholder="••••••••" className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-2 text-gray-300">Confirm Password</label>
                                        <div className="relative">
                                            <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                            <input type="password" {...register("confirmPassword")} placeholder="••••••••" className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                                        </div>
                                    </div>
                                </div>
                                { errors.password && ( <div className="text-red-500 text-sm pb-2 px-2">{errors.password.message}</div> ) }
                                { errors.confirmPassword && ( <div className="text-red-500 text-sm pb-2 px-2">{errors.confirmPassword.message}</div> ) }
                                <button type="submit" disabled={loading || isSubmitting} className="w-full cursor-pointer py-3 rounded-lg font-semibold text-white bg-linear-to-r from-orange-500 via-purple-500 to-cyan-500 hover:opacity-90 transition">
                                    {loading ? "Creating Account..." : "Create Account"}
                                </button>
                            </form>
                            <p className="mt-8 text-center text-sm text-gray-400">
                                Already have an account?{' '}
                                <Link href="/login" className="font-medium text-orange-400 hover:text-orange-300 transition-colors">Login Now</Link>
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}