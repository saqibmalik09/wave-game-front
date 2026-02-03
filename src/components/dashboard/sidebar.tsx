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
    Users,
    Megaphone,
    ChevronDown,
    Sliders,
    FileText,
    ScrollText
} from 'lucide-react'

type NavItem = {
    name: string
    href?: string
    icon: any
    subItems?: NavItem[]
}

const navItems: NavItem[] = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'User Management', href: '/dashboard/users', icon: Users },
    { name: 'Games Management', href: '/dashboard/games', icon: Gamepad2 },
    { name: 'Broadcast Messages', href: '/dashboard/broadcast', icon: Megaphone },
    {
        name: 'Game Settings',
        icon: Sliders,
        subItems: [
            { name: 'Greedy Teen Patti', href: '/dashboard/game-settings/greedy-teenpatti', icon: Gamepad2 },
            { name: 'Fruit Game', href: '/dashboard/game-settings/fruit-game', icon: Gamepad2 },
            { name: 'Teen Patti 3', href: '/dashboard/game-settings/teenpatti-3', icon: Gamepad2 },
        ]
    },
    {
        name: 'Game Logs',
        icon: FileText,
        subItems: [
            { name: 'Greedy Teen Patti', href: '/dashboard/game-logs/greedy-teenpatti', icon: ScrollText },
            { name: 'Fruit Game', href: '/dashboard/game-logs/fruit-game', icon: ScrollText },
            { name: 'Teen Patti 3', href: '/dashboard/game-logs/teenpatti-3', icon: ScrollText },
        ]
    },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar({ mobileOpen, setMobileOpen, collapsed }: { mobileOpen: boolean, setMobileOpen: (open: boolean) => void, collapsed: boolean }) {
    const pathname = usePathname()
    const [expandedMenus, setExpandedMenus] = useState<string[]>([])

    const toggleMenu = (menuName: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(name => name !== menuName)
                : [...prev, menuName]
        )
    }

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
                                WaveGame
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
                        const hasSubItems = item.subItems && item.subItems.length > 0
                        const isExpanded = expandedMenus.includes(item.name)
                        const Icon = item.icon

                        return (
                            <div key={item.name}>
                                {/* Main Menu Item */}
                                {hasSubItems ? (
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={cn(
                                            "w-full group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden",
                                            "text-muted-foreground hover:text-foreground hover:bg-accent",
                                            collapsed && "justify-center px-2"
                                        )}
                                        title={collapsed ? item.name : undefined}
                                    >
                                        <Icon className={cn("w-5 h-5 transition-colors shrink-0", "text-muted-foreground group-hover:text-foreground")} />
                                        {!collapsed && <span>{item.name}</span>}
                                        {!collapsed && (
                                            <ChevronDown className={cn("w-4 h-4 ml-auto transition-transform", isExpanded && "rotate-180")} />
                                        )}
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href!}
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
                                )}

                                {/* Sub Menu Items */}
                                {hasSubItems && isExpanded && !collapsed && (
                                    <div className="mt-1 ml-4 space-y-1 border-l-2 border-border/50 pl-3">
                                        {item.subItems!.map((subItem) => {
                                            const isSubActive = pathname === subItem.href
                                            const SubIcon = subItem.icon

                                            return (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href!}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={cn(
                                                        "group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                                        isSubActive
                                                            ? "text-primary bg-primary/10"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                                    )}
                                                >
                                                    <SubIcon className={cn("w-4 h-4 transition-colors shrink-0", isSubActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                                    <span className="text-xs">{subItem.name}</span>
                                                    {isSubActive && <ChevronRight className="w-3 h-3 ml-auto text-primary/50" />}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
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
