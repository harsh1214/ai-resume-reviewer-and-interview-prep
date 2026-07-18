"use client";

import { useState } from "react";
import { IconLock } from "@tabler/icons-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import axios from "axios";

export default function ChangePasswordCard() {

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const handleSubmit = async () => {
        if (form.new_password !== form.confirm_password) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await api.post("/api/auth/change-password", {
                current_password: form.current_password,
                new_password: form.new_password,
            }
            )
            toast.success("Password updated successfully");
            setForm({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });
        }
        // catch (error: any) {
        //     console.log(error)
        //     toast.error("Error: " + error.response.data.detail);
        // }
        catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.detail || "Something went wrong");
            } else {
                toast.error("Unexpected error");
            }
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card-bg border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
                <IconLock size={20} className="text-orange-400" />
                <h2 className="text-xl font-semibold text-white">Change Password</h2>
            </div>
            <div className="space-y-4">
                <input type="password" placeholder="Current Password" value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white" />
                <input type="password" placeholder="New Password" value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white" />
                <input type="password" placeholder="Confirm Password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white" />
                <button onClick={handleSubmit} disabled={loading} className="w-full bg-linear-to-r from-orange-500 to-purple-600 text-white py-3 rounded-lg">
                    {loading
                        ? "Updating..."
                        : "Update Password"}
                </button>
            </div>
        </div>
    );
}