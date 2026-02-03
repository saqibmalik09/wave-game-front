'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    LayoutDashboard,
    BarChart3,
    Gamepad2,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Games Management', href: '/dashboard/games', icon: Gamepad2 },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (open: boolean) => void }) {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-72 bg-zinc-950 border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                <span className="font-bold text-white">W</span>
                            </div>
                            <span className="text-lg font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                WaveLive
                            </span>
                        </div>
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden text-zinc-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Nav */}
                    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                        <div className="mb-2 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            Main Menu
                        </div>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden",
                                        isActive
                                            ? "text-white bg-white/5"
                                            : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full" />
                                    )}
                                    <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300")} />
                                    <span>{item.name}</span>
                                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-purple-400 opacity-50" />}
                                </Link>
                            )
                        })}
                    </div>

                    {/* User Profile */}
                    <div className="p-4 border-t border-white/5">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
                                <span className="text-zinc-400 font-medium">AD</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">Admin User</p>
                                <p className="text-xs text-zinc-500 truncate">admin@wavelive.com</p>
                            </div>
                            <Link href="/login" className="p-2 text-zinc-400 hover:text-red-400 transition-colors" title="Logout">
                                <LogOut className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}
