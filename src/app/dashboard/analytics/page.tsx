'use client'

import { useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts'
import { ChevronDown, Download, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Mock Data
const data = [
    { name: 'Mon', users: 4000, revenue: 2400 },
    { name: 'Tue', users: 3000, revenue: 1398 },
    { name: 'Wed', users: 2000, revenue: 9800 },
    { name: 'Thu', users: 2780, revenue: 3908 },
    { name: 'Fri', users: 1890, revenue: 4800 },
    { name: 'Sat', users: 2390, revenue: 3800 },
    { name: 'Sun', users: 3490, revenue: 4300 },
]

const companies = [
    { id: 1, name: 'WaveLive HQ' },
    { id: 2, name: 'Partner One Corp' },
    { id: 3, name: 'Gaming Guild Ltd' },
]

export default function AnalyticsPage() {
    const [selectedCompany, setSelectedCompany] = useState(companies[0])
    const [dropdownOpen, setDropdownOpen] = useState(false)

    return (
        <div className="space-y-8">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                    <p className="text-zinc-400">Detailed performance metrics for {selectedCompany.name}.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Custom Premium Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors"
                        >
                            {selectedCompany.name}
                            <ChevronDown className="w-4 h-4 text-zinc-500" />
                        </button>

                        <AnimatePresence>
                            {dropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setDropdownOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 py-1"
                                    >
                                        {companies.map((company) => (
                                            <button
                                                key={company.id}
                                                onClick={() => {
                                                    setSelectedCompany(company)
                                                    setDropdownOpen(false)
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-800 transition-colors",
                                                    selectedCompany.id === company.id ? "text-purple-400 bg-purple-500/10" : "text-zinc-300"
                                                )}
                                            >
                                                {company.name}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <button className="p-2 bg-zinc-900 border border-white/10 rounded-xl hover:text-white text-zinc-400 transition-colors">
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Large Chart */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold text-white mb-6">Revenue Overview</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e4e4e7' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Charts/Stats */}
                <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl">
                        <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                        cursor={{ fill: '#27272a' }}
                                    />
                                    <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 p-6 rounded-2xl">
                        <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-widest mb-1">Total Impact</h3>
                        <p className="text-3xl font-bold text-white mb-2">$128,493</p>
                        <div className="flex items-center gap-2 text-sm text-indigo-200">
                            <span className="bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300 font-mono">+12.5%</span>
                            <span>vs last month</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
