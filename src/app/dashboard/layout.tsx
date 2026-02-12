'use client'

import { useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { Menu, Search, Bell, CheckCircle2, User } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { logout } from '@/lib/redux/slices/authSlice'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        router.push('/login')
    }

    const getUserInitials = () => {
        if (!user) return 'U'
        return user.name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
                <DashboardSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={collapsed} />

                <div className="flex-1 flex flex-col min-h-0 overflow-hidden lg:pl-0">
                    {/* Top Header */}
                    <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-8 bg-background/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="lg:hidden p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCollapsed(!collapsed)}
                                className="hidden lg:flex p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h2 className="text-lg font-semibold hidden md:block text-foreground">
                                Dashboard
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative hidden md:block group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-accent/50 border border-input rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground w-64 text-foreground transition-all"
                                />
                            </div>

                            <ThemeToggle />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="relative p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors outline-none">
                                        <Bell className="w-5 h-5" />
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background animate-pulse" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-80">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <div className="max-h-[300px] overflow-y-auto">
                                        <DropdownMenuItem className="cursor-pointer gap-4 p-3 items-start">
                                            <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 shrink-0" />
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">New Game Added</p>
                                                <p className="text-xs text-muted-foreground">Cyber Racer 2077 was added to the catalog.</p>
                                                <p className="text-[10px] text-muted-foreground/60">2 mins ago</p>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer gap-4 p-3 items-start">
                                            <div className="h-2 w-2 mt-1.5 rounded-full bg-green-500 shrink-0" />
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">System Update</p>
                                                <p className="text-xs text-muted-foreground">Platform version 2.4.0 is now live.</p>
                                                <p className="text-[10px] text-muted-foreground/60">1 hour ago</p>
                                            </div>
                                        </DropdownMenuItem>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="p-2 justify-center text-primary text-xs font-medium cursor-pointer">
                                        View all properties
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-medium text-xs hover:ring-2 ring-primary/20 transition-all outline-none">
                                        {getUserInitials()}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium">{user?.name}</p>
                                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={handleLogout}>
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Main Content Scrollable Area */}
                    <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    )
}
