"use client";

import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
import { IconUserEdit, IconMail, IconPhone, IconBriefcase, IconMapPin, IconEdit, IconCamera, IconDeviceFloppy, IconUser } from "@tabler/icons-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ProfileData {
    id?: number;
    username: string;
    full_name: string;
    email: string;
    phone: string;
    location: string;
    role: string;
    bio: string;
    avatar_url?: string;
    created_at?: string;
    last_login?: string;
}

export default function ProfileForm() {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState<ProfileData>({
        username: "",
        full_name: "",
        email: "",
        phone: "",
        location: "",
        role: "",
        bio: "",
        avatar_url: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/auth/me");
                setProfile({
                    ...res.data,
                    phone: res.data.phone || "",
                    location: res.data.location || "",
                    role: res.data.role || "",
                    bio: res.data.bio || "",
                });
            } catch {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({...profile, [e.target.name]: e.target.value});
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await api.put("/api/auth/me", {
                full_name: profile.full_name,
                phone: profile.phone,
                location: profile.location,
                role: profile.role,
                bio: profile.bio,
                avatar_url: profile.avatar_url,
            });
            toast.success("Profile updated");
            setIsEditing(false);
        } catch (error: unknown) {
            console.log(error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-card-bg border border-border rounded-2xl p-6">
                <p className="text-gray-400">
                    Loading profile...
                </p>
            </div>
        );
    }

    return (
        //  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        <div className="bg-card-bg rounded-2xl shadow-lg overflow-hidden border border-border">
            <div className="h-36 gradient-bg" />
            <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-center -mt-16">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-card-bg bg-background flex items-center justify-center">
                            <IconUser size={60} className="text-gray-500" />
                        </div>
                        <button className="absolute bottom-0 right-0 bg-linear-to-r from-orange-500 to-purple-600 text-white p-2 rounded-full">
                            <IconCamera size={16} />
                        </button>
                    </div>
                </div>
                <div className="flex flex-row items-center justify-between mt-6 py-4">
                    <div className="">
                        <h2 className="text-2xl font-bold text-white">
                                {profile.full_name || profile.username}
                            </h2>
                            <p className="text-gray-400">{profile.role || "No role set"}</p>
                    </div>
                    <button onClick={isEditing ? handleSave : () => setIsEditing(true)} disabled={saving} className="bg-linear-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <IconDeviceFloppy size={18} />
                                {saving ? (<p className="max-md:hidden">Saving...</p>) : (<p className="max-md:hidden">Save Changes</p>)}
                            </>
                        ) : (
                            <>
                                <IconEdit size={18} />
                                <p className="max-md:hidden">Edit Profile</p>
                            </>
                        )}
                    </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div>
                        <label className="text-sm text-gray-400 flex items-center gap-2"><IconUserEdit size={16} />Full Name</label>
                        <input name="full_name" value={profile.full_name} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 px-4 py-3 bg-background border border-border rounded-lg text-white disabled:opacity-70" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 flex items-center gap-2"><IconUserEdit size={16} />Username</label>
                        <input value={profile.username} disabled className="w-full mt-1 px-4 py-3 bg-background border border-border rounded-lg text-white opacity-70" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 flex items-center gap-2"><IconMail size={16} />Email</label>
                        <input value={profile.email} disabled className="w-full mt-1 px-4 py-3 bg-background border border-border rounded-lg text-white opacity-70" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 flex items-center gap-2"><IconPhone size={16} />Phone</label>
                        <input name="phone" value={profile.phone} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 px-4 py-3 bg-background border border-border rounded-lg text-white" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 flex items-center gap-2"><IconMapPin size={16} />Location</label>
                        <input name="location" value={profile.location} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 px-4 py-3 bg-background border border-border rounded-lg text-white" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 flex items-center gap-2"><IconBriefcase size={16} />Role</label>
                        <input name="role" value={profile.role} onChange={handleChange} disabled={!isEditing} className="w-full mt-1 px-4 py-3 bg-background border border-border rounded-lg text-white" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-400">Bio</label>
                        <textarea name="bio" value={profile.bio} onChange={handleChange} disabled={!isEditing} rows={4} className="w-full mt-1 px-4 py-3 bg-background border border-border rounded-lg text-white" />
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-border text-sm text-gray-400 space-y-2">
                    <p>
                        Joined:{" "}
                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}
                    </p>
                    <p>
                        Last Login:
                        {" "}
                        {profile.last_login ? new Date(profile.last_login).toLocaleString() : "Never"}
                    </p>
                </div>
            </div>
        </div>
    );
}