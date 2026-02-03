'use client'

import { Users, Activity, DollarSign, Gamepad2, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                <p className="text-zinc-400">Welcome back, here's what's happening today.</p>
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
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                                    <Activity className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-zinc-200">New user registration</p>
                                    <p className="text-xs text-zinc-500">2 minutes ago</p>
                                </div>
                                <span className="text-xs font-medium text-blue-400">+ User</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Status */}
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/10 rounded-2xl p-6 relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-lg font-semibold text-white mb-2">System Status</h3>
                        <p className="text-zinc-400 text-sm mb-6">All systems are running smoothly. No incidents reported in the last 24 hours.</p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-300">Database Cluster</span>
                                <span className="text-green-400 font-medium">Operational</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-300">Game Servers</span>
                                <span className="text-green-400 font-medium">98% Load</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-300">Auth Service</span>
                                <span className="text-green-400 font-medium">Operational</span>
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
        blue: "text-blue-400 bg-blue-400/10",
        green: "text-emerald-400 bg-emerald-400/10",
        purple: "text-purple-400 bg-purple-400/10",
        orange: "text-orange-400 bg-orange-400/10",
    }

    return (
        <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors[color]} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend === 'up' ? (
                    <div className="flex items-center text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2 py-1 rounded-full">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        {change}
                    </div>
                ) : (
                    <div className="flex items-center text-red-400 text-xs font-medium bg-red-400/10 px-2 py-1 rounded-full">
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                        {change}
                    </div>
                )}
            </div>
            <h3 className="text-zinc-400 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    )
}
