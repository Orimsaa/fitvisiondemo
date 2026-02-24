"use client";

import DashboardLayout from "@/components/DashboardLayout";
import React, { useState } from "react";

type Tab = "profile" | "notifications" | "preferences" | "privacy";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [isSaving, setIsSaving] = useState(false);
    const [savedAlert, setSavedAlert] = useState(false);

    // Mock settings state
    const [units, setUnits] = useState("kg");
    const [theme, setTheme] = useState("dark");
    const [pushNotifs, setPushNotifs] = useState(true);
    const [emailNotifs, setEmailNotifs] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setSavedAlert(true);
            setTimeout(() => setSavedAlert(false), 3000);
        }, 800);
    };

    return (
        <DashboardLayout>
            <div className="max-w-[1000px] mx-auto p-6 md:p-10 flex flex-col gap-8 pb-32">
                {/* Premium Header Section */}
                <div className="flex flex-col gap-2 mb-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-4xl md:text-5xl drop-shadow-[0_0_12px_rgba(57,255,20,0.4)]">settings</span>
                        Settings
                    </h1>
                    <p className="text-slate-400 font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary/80 text-sm">manage_accounts</span>
                        Manage your profile, preferences, and account details.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Nav for Settings */}
                    <div className="lg:col-span-1 flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${activeTab === "profile"
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-inner"
                                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <span className="material-symbols-outlined">person</span>
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("notifications")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${activeTab === "notifications"
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-inner"
                                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <span className="material-symbols-outlined">notifications</span>
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab("preferences")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${activeTab === "preferences"
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-inner"
                                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <span className="material-symbols-outlined">tune</span>
                            Preferences
                        </button>
                        <button
                            onClick={() => setActiveTab("privacy")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-left ${activeTab === "privacy"
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-inner"
                                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                                }`}
                        >
                            <span className="material-symbols-outlined">lock</span>
                            Privacy & Security
                        </button>
                    </div>

                    {/* Main Settings Content */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        {/* Tab Content Wrappers */}
                        <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden min-h-[400px]">
                            {/* Decorative Top Border */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-transparent opacity-80"></div>

                            {activeTab === "profile" && (
                                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">Profile Information</h2>
                                        <p className="text-sm text-slate-400">Update your personal details here.</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div
                                            className="bg-center bg-no-repeat bg-cover rounded-full size-24 ring-4 ring-primary/20 shadow-neon shrink-0"
                                            style={{
                                                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDXffCakVRarFoNQFrA4K7x22dBozfhsCf4wktXzY1OZGVk5RKCXqRMx3JZRNx5BOv0nhv-CDxFys6quSum4CCeuuY5AE-2K2rF2PG-9ov-2Ki_8to7wSgmJqgIEy6KqiG9FC5kM8TulNc_0SIfhfTmBbtAboV1n7XkUpJOFYw2bz1oA5SR0aQATkET1hR6-eOseSCjj6TcARG9zS_7JyYXM--QkV1y9hlqKvVOGTPt25uOtAn4yeH_dVyi6fcQlIFUqrWg1ZFVVTpt")',
                                            }}
                                        ></div>
                                        <div className="flex flex-col gap-3">
                                            <button className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors text-sm border border-white/5">
                                                Change Avatar
                                            </button>
                                            <button className="text-slate-400 hover:text-red-400 transition-colors text-sm text-left">
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-slate-400">First Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Alex"
                                                className="bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-white/20"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-slate-400">Last Name</label>
                                            <input
                                                type="text"
                                                defaultValue="Morgan"
                                                className="bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-white/20"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2 md:col-span-2">
                                            <label className="text-sm font-medium text-slate-400">Email Address</label>
                                            <input
                                                type="email"
                                                defaultValue="alex.morgan@fitvision.app"
                                                className="bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-white/20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "notifications" && (
                                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">Notifications</h2>
                                        <p className="text-sm text-slate-400">Control how you receive alerts and updates.</p>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-background-dark/50 hover:bg-background-dark transition-colors">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white">Push Notifications</span>
                                                <span className="text-sm text-slate-400">Receive alerts on your device for workout reminders.</span>
                                            </div>
                                            {/* Custom Toggle */}
                                            <button
                                                onClick={() => setPushNotifs(!pushNotifs)}
                                                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${pushNotifs ? "bg-primary" : "bg-slate-700"}`}
                                            >
                                                <span className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${pushNotifs ? "translate-x-7" : "translate-x-1"}`}></span>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-background-dark/50 hover:bg-background-dark transition-colors">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white">Email Digests</span>
                                                <span className="text-sm text-slate-400">Receive weekly summaries of your form progress.</span>
                                            </div>
                                            {/* Custom Toggle */}
                                            <button
                                                onClick={() => setEmailNotifs(!emailNotifs)}
                                                className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${emailNotifs ? "bg-primary" : "bg-slate-700"}`}
                                            >
                                                <span className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${emailNotifs ? "translate-x-7" : "translate-x-1"}`}></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "preferences" && (
                                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">App Preferences</h2>
                                        <p className="text-sm text-slate-400">Customize your app experience.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-slate-400">Weight Units</label>
                                            <div className="relative">
                                                <select
                                                    value={units}
                                                    onChange={(e) => setUnits(e.target.value)}
                                                    className="appearance-none bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-white/20 w-full font-medium"
                                                >
                                                    <option value="kg">Kilograms (kg)</option>
                                                    <option value="lbs">Pounds (lbs)</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-slate-400">Theme</label>
                                            <div className="relative">
                                                <select
                                                    value={theme}
                                                    onChange={(e) => setTheme(e.target.value)}
                                                    className="appearance-none bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all hover:border-white/20 w-full font-medium"
                                                >
                                                    <option value="dark">Dark Mode (Default)</option>
                                                    <option value="system">System Default</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-3 top-3 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "privacy" && (
                                <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">Privacy & Security</h2>
                                        <p className="text-sm text-slate-400">Keep your account and camera data secure.</p>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <button className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-background-dark/50 hover:bg-background-dark transition-colors text-left group">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors">key</span>
                                                <span className="font-bold text-white">Change Password</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                                        </button>
                                        <button className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-background-dark/50 hover:bg-background-dark transition-colors text-left group">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors">visibility_off</span>
                                                <span className="font-bold text-white">Camera Data Usage</span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                                        </button>
                                        <div className="flex flex-col gap-1 px-4 text-sm text-slate-400 mt-2 mb-4">
                                            <p>Your camera data is processed securely.</p>
                                        </div>
                                        <button className="flex items-center justify-between p-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors text-left mt-4 group">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-red-500">delete_forever</span>
                                                <span className="font-bold text-red-500">Delete Account</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Subscription & Save Actions Row */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Pro Badge */}
                            <div className="bg-gradient-to-r from-surface-dark to-surface-darker border border-primary/20 rounded-xl px-5 py-4 flex items-center gap-4 relative overflow-hidden group w-full md:w-auto shrink-0 shadow-lg">
                                <div className="absolute -right-4 -bottom-4 size-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                                <span className="material-symbols-outlined text-primary text-3xl drop-shadow-[0_0_8px_rgba(57,255,20,0.5)] z-10">verified</span>
                                <div className="flex flex-col z-10">
                                    <h3 className="text-base font-bold text-white leading-tight">FitVision Pro Active</h3>
                                    <p className="text-slate-400 text-xs">Renews Dec 31, 2026</p>
                                </div>
                            </div>

                            {/* Save Actions */}
                            <div className="flex justify-end gap-3 w-full md:w-auto items-center">
                                {savedAlert && (
                                    <div className="text-primary text-sm font-bold flex items-center gap-1 animate-in slide-in-from-right fade-in px-3">
                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                        Saved
                                    </div>
                                )}
                                <button className="px-5 py-3 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors hidden sm:block">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-8 py-3 rounded-xl font-bold bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
