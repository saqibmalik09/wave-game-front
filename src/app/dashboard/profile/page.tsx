'use client'

import { useState } from 'react'
import { Camera, Mail, User, Shield, Key, Save } from 'lucide-react'

export default function ProfilePage() {
    const [loading, setLoading] = useState(false)

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                <p className="text-zinc-400">Manage your personal information and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Quick Info */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex flex-col items-center text-center">
                        <div className="relative group mb-4">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 p-[2px]">
                                <div className="w-full h-full rounded-full bg-zinc-900 border-4 border-zinc-900 flex items-center justify-center overflow-hidden">
                                    <span className="text-2xl font-bold text-white">AD</span>
                                    {/* <img src="..." alt="Profile" className="w-full h-full object-cover" /> */}
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full border border-zinc-700 transition-colors shadow-lg">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>

                        <h2 className="text-xl font-bold text-white">Admin User</h2>
                        <p className="text-zinc-500 text-sm mb-4">Super Administrator</p>

                        <div className="w-full py-4 border-t border-white/5 flex justify-center gap-6">
                            <div className="text-center">
                                <p className="text-lg font-bold text-white">12</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Games</p>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold text-white">2.4y</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider">Tenure</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="lg:col-span-2 space-y-6">

                    {/* General Information */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-400" />
                            General Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="Admin User"
                                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Username</label>
                                <input
                                    type="text"
                                    defaultValue="admin_master"
                                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-zinc-400">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="email"
                                        defaultValue="admin@wavelive.com"
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-zinc-200 focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/20"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-400" />
                            Security & Password
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Current Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="password"
                                        placeholder="Enter current password"
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-zinc-200 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Min 8 chars"
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Confirm Password</label>
                                    <input
                                        type="password"
                                        placeholder="Re-enter new password"
                                        className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-zinc-200 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-purple-900/20 transition-all active:scale-95"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
