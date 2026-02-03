'use client'

import { Users, Activity, DollarSign, Gamepad2, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
                <p className="text-muted-foreground">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value="24,532"
                    change="+12%"
                    trend="up"
                    icon={Users}
                    color="blue"
                />
                <StatsCard
                    title="Active Sessions"
                    value="1,204"
                    change="+8%"
                    trend="up"
                    icon={Activity}
                    color="green"
                />
                <StatsCard
                    title="Total Revenue"
                    value="$84,232"
                    change="+23%"
                    trend="up"
                    icon={DollarSign}
                    color="purple"
                />
                <StatsCard
                    title="Active Games"
                    value="12"
                    change="-2"
                    trend="down"
                    icon={Gamepad2}
                    color="orange"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-accent transition-colors">
                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border border-border">
                                    <Activity className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">New user registration</p>
                                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                                </div>
                                <span className="text-xs font-medium text-primary">+ User</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Status */}
                <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-foreground mb-2">System Status</h3>
                        <p className="text-muted-foreground text-sm mb-6">All systems are running smoothly. No incidents reported in the last 24 hours.</p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Database Cluster</span>
                                <span className="text-green-500 font-medium">Operational</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Game Servers</span>
                                <span className="text-green-500 font-medium">98% Load</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Auth Service</span>
                                <span className="text-green-500 font-medium">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatsCard({ title, value, change, trend, icon: Icon, color }: any) {
    const colors: any = {
        blue: "text-blue-500 bg-blue-500/10",
        green: "text-emerald-500 bg-emerald-500/10",
        purple: "text-purple-500 bg-purple-500/10",
        orange: "text-orange-500 bg-orange-500/10",
    }

    return (
        <div className="bg-card border border-border p-6 rounded-2xl hover:border-primary/20 transition-colors group shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend === 'up' ? (
                    <div className="flex items-center text-emerald-500 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded-full">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {change}
                    </div>
                ) : (
                    <div className="flex items-center text-red-500 text-xs font-medium bg-red-500/10 px-2 py-1 rounded-full">
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                        {change}
                    </div>
                )}
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
    )
}
