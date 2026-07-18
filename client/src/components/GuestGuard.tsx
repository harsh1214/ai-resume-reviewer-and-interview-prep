"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function GuestGuard({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setLoading(false);
                    return;
                }
                await api.get("/api/auth/me");
                router.replace("/dashboard");
            } 
            catch {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                setLoading(false);
            }
        };

        checkAuth();

    }, [router]);


    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 min-h-92">
                <div className="relative">
                    <div className="relative w-16 h-16">
                        <div className="absolute w-full h-full rounded-full border border-gray-100/10 border-r-[#0ff] border-b-[#0ff] animate-spin duration-300"></div>
                    </div>
                    <div className="absolute inset-0 bg-linear-to-tr from-[#0ff]/10 via-transparent to-[#0ff]/5 animate-pulse rounded-full blur-sm"></div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}