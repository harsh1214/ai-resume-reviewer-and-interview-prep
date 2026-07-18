"use client";

import ChangePasswordCard from "@/components/ChangePasswordCard";
import ProfileForm from "@/components/ProfileForm";
import { motion } from "framer-motion";

export default function ProfilePage() {
    return (
        <div className="bg-background ">
            <div className="w-full container mx-auto px-4 sm:px-6 lg:px-8 lg:py-20 py-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                        <p className="text-gray-400 mt-2">Manage your account information and security.</p>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <ProfileForm />
                        </div>
                        <div>
                            <ChangePasswordCard />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}