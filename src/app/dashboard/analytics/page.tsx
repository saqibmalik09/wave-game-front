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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportToExcel } from '@/lib/export'
import { toast } from 'sonner'

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

    const handleDownload = () => {
        exportToExcel(data, `${selectedCompany.name}_Analytics_Export`)
        toast.success("Analytics data exported successfully")
    }

    return (
        <div className="space-y-8">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
                    <p className="text-muted-foreground">Detailed performance metrics for {selectedCompany.name}.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Custom Premium Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="flex items-center gap-2 bg-card border border-input px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors outline-none"
                            >
                                {selectedCompany.name}
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {companies.map((company) => (
                                <DropdownMenuItem
                                    key={company.id}
                                    onClick={() => setSelectedCompany(company)}
                                    className={cn(
                                        "cursor-pointer",
                                        selectedCompany.id === company.id && "bg-primary/10 text-primary focus:bg-primary/10 focus:text-primary"
                                    )}
                                >
                                    {company.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 transition-colors shadow-sm text-sm font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Main Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Large Chart */}
                <div className="lg:col-span-2 bg-card border border-border p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Overview</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--popover-foreground)' }}
                                    itemStyle={{ color: 'var(--primary)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Secondary Charts/Stats */}
                <div className="space-y-6">
                    <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                        <h3 className="text-lg font-semibold text-foreground mb-4">User Growth</h3>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                        cursor={{ fill: 'var(--muted)' }}
                                    />
                                    <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 rounded-2xl">
                        <h3 className="text-sm font-medium text-indigo-500 uppercase tracking-widest mb-1">Total Impact</h3>
                        <p className="text-3xl font-bold text-foreground mb-2">$128,493</p>
                        <div className="flex items-center gap-2 text-sm text-indigo-500/80">
                            <span className="bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-500 font-mono">+12.5%</span>
                            <span>vs last month</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
