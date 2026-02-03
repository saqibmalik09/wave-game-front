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
    X,
    ChevronRight,
    Users
} from 'lucide-react'

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'User Management', href: '/dashboard/users', icon: Users },
    { name: 'Games Management', href: '/dashboard/games', icon: Gamepad2 },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar({ mobileOpen, setMobileOpen, collapsed }: { mobileOpen: boolean, setMobileOpen: (open: boolean) => void, collapsed: boolean }) {
    const pathname = usePathname()

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full bg-card border-r border-border transition-all duration-300 ease-in-out lg:static flex flex-col",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    collapsed ? "w-20" : "w-72"
                )}
            >
                {/* Header */}
                <div className={cn("flex h-16 shrink-0 items-center px-4 border-b border-border", collapsed ? "justify-center" : "justify-between px-6")}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
                            <span className="font-bold text-white">W</span>
                        </div>
                        {!collapsed && (
                            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent fade-in animate-in duration-300">
                                WaveLive
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden text-muted-foreground hover:text-foreground"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                    {!collapsed && (
                        <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider fade-in">
                            Main Menu
                        </div>
                    )}
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
                                    isActive
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent",
                                    collapsed && "justify-center px-2"
                                )}
                                title={collapsed ? item.name : undefined}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                )}
                                <Icon className={cn("w-5 h-5 transition-colors shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                {!collapsed && <span>{item.name}</span>}
                                {!collapsed && isActive && <ChevronRight className="w-4 h-4 ml-auto text-primary/50" />}
                            </Link>
                        )
                    })}
                </div>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-border mt-auto">
                    <div className={cn("flex items-center gap-3 p-2 rounded-xl bg-accent/30 border border-border/50 hover:bg-accent/50 transition-colors", collapsed && "justify-center p-0 bg-transparent border-none hover:bg-transparent")}>
                        <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center border border-border shrink-0">
                            <span className="text-muted-foreground text-xs font-bold">AD</span>
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">Admin User</p>
                                <p className="text-[10px] text-muted-foreground truncate">admin@wavegames.com</p>
                            </div>
                        )}
                        {!collapsed && (
                            <Link href="/login" className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="Logout">
                                <LogOut className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </aside>
        </>
    )
}
