'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { IconMail, IconLock } from '@tabler/icons-react'
import Image from 'next/image'
import AuthImage from "@/assets/auth.jpg"
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { z } from 'zod'

const emailSchema = z.object({
    email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
});

const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
});

const passwordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password too long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Must contain uppercase, lowercase and number"),
    confirmPassword: z.string(),
}).refine(
    (data) => data.password === data.confirmPassword,
    { message: "Passwords do not match", path: ["confirmPassword"] }
);

export default function ForgotPassword() {

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [passwords, setPasswords] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const sendOTP = async () => {
        const result = emailSchema.safeParse({ email });

        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        try {
            setLoading(true);
            await api.post("/api/auth/forgot-password", { email });
            toast.success("OTP sent successfully");
            setStep(2);

        }
        catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.detail || "Something went wrong");
            } else {
                toast.error("Unexpected error");
            }
        }
        finally {
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        const result = otpSchema.safeParse({ otp });

        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        try {
            setLoading(true);
            await api.post("/api/auth/verify-otp", { email, otp });
            toast.success("OTP verified");
            setStep(3);
        }
        catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.detail || "Something went wrong");
            } else {
                toast.error("Unexpected error");
            }
        }
        finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        const result = passwordSchema.safeParse(passwords);
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            return;
        }

        try {
            setLoading(true);
            await api.post("/api/auth/reset-password", { email, otp, new_password: passwords.password });
            toast.success("Password reset successful");
            router.replace("/login");
        }
        catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.detail || "Something went wrong");
            } else {
                toast.error("Unexpected error");
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
                                <h2 className="text-3xl font-bold gradient-text">Forgot Password</h2>
                                <p className="text-gray-400 mt-2">Manage your account information and security.</p>
                            </div>
                            <div className="flex items-center gap-2 mb-8">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className={`h-2 flex-1 rounded-full ${step >= item ? "bg-orange-500" : "bg-gray-700"}`} />
                                ))}
                            </div>
                            {step === 1 && (
                                <div>
                                    <label className="block text-sm mb-2 text-gray-300">Email</label>
                                    <div className="relative">
                                        <IconMail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white" />
                                    </div>
                                    <button onClick={sendOTP} disabled={loading} className="mt-6 w-full bg-linear-to-r from-orange-500 to-purple-600 text-white py-3 cursor-pointer rounded-lg">
                                        {loading
                                            ? "Sending..."
                                            : "Send OTP"}
                                    </button>
                                </div>
                            )}
                            {step === 2 && (
                                <div>
                                    <label className="block text-sm mb-2 text-gray-300">OTP</label>
                                    <input maxLength={6} type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" className="w-full py-3 px-4 rounded-lg bg-background border border-border text-white" />
                                    <button onClick={verifyOTP} disabled={loading} className="mt-6 w-full bg-linear-to-r from-orange-500 to-purple-600 text-white py-3 cursor-pointer rounded-lg">
                                        {loading
                                            ? "Verifying..."
                                            : "Verify OTP"}
                                    </button>
                                </div>
                            )}
                            {step === 3 && (
                                <div className="space-y-5">
                                    <div className="relative">
                                        <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                        <input type="password" placeholder="New Password" value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white" />
                                    </div>
                                    <div className="relative">
                                        <IconLock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                        <input type="password" placeholder="Confirm Password" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} className="w-full pl-10 py-3 px-4 rounded-lg bg-background border border-border text-white" />
                                    </div>
                                    <button onClick={resetPassword} disabled={loading} className="w-full bg-linear-to-r from-orange-500 to-purple-600 text-white py-3 cursor-pointer rounded-lg">
                                        {loading
                                            ? "Updating..."
                                            : "Reset Password"}
                                    </button>
                                </div>

                            )}
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