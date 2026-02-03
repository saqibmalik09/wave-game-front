'use client'

import { useState } from 'react'
import { Search, Filter, Download, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Pagination } from '@/components/ui/pagination'

interface GameLog {
    id: string
    userId: string
    gameRoundId: string
    userBet: number
    rewarded: boolean
    winning: 'yes' | 'no' | 'failed'
    failedReason?: string
    profit?: number
    dateTime: string
}

// Mock data for demonstration
const generateMockLogs = (): GameLog[] => {
    const failedReasons = ['Internet issue', 'Max Bet limit reached']
    const logs: GameLog[] = []

    for (let i = 0; i < 45; i++) {
        const winning = Math.random() > 0.5 ? 'yes' : Math.random() > 0.3 ? 'no' : 'failed'
        const userBet = Math.floor(Math.random() * 50000) + 1000

        logs.push({
            id: `LOG-${3000 + i}`,
            userId: `USR-${Math.floor(Math.random() * 900) + 100}`,
            gameRoundId: `TP3-${Math.floor(Math.random() * 9000) + 1000}`,
            userBet,
            rewarded: winning === 'yes' ? Math.random() > 0.3 : false,
            winning,
            failedReason: winning === 'failed' ? failedReasons[Math.floor(Math.random() * failedReasons.length)] : undefined,
            profit: winning === 'yes' ? Math.floor(userBet * (Math.random() * 3 + 1)) : winning === 'no' ? -userBet : 0,
            dateTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        })
    }

    return logs.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
}

const ITEMS_PER_PAGE = 10

export default function TeenPatti3Logs() {
    const [logs] = useState<GameLog[]>(generateMockLogs())
    const [searchUserId, setSearchUserId] = useState('')
    const [winningFilter, setWinningFilter] = useState<'all' | 'yes' | 'no' | 'failed'>('all')
    const [rewardedFilter, setRewardedFilter] = useState<'all' | 'yes' | 'no'>('all')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const [currentPage, setCurrentPage] = useState(1)

    const filteredLogs = logs.filter(log => {
        const matchesUserId = !searchUserId || log.userId.toLowerCase().includes(searchUserId.toLowerCase())
        const matchesWinning = winningFilter === 'all' || log.winning === winningFilter
        const matchesRewarded = rewardedFilter === 'all' || (rewardedFilter === 'yes' ? log.rewarded : !log.rewarded)

        let matchesDate = true
        if (dateFrom) {
            matchesDate = matchesDate && new Date(log.dateTime) >= new Date(dateFrom)
        }
        if (dateTo) {
            matchesDate = matchesDate && new Date(log.dateTime) <= new Date(dateTo + 'T23:59:59')
        }

        return matchesUserId && matchesWinning && matchesRewarded && matchesDate
    })

    // Reset page if out of bounds
    if (currentPage > Math.max(1, Math.ceil(filteredLogs.length / ITEMS_PER_PAGE))) {
        setCurrentPage(1)
    }

    const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
    const paginatedLogs = filteredLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    // Statistics
    const totalBets = filteredLogs.reduce((sum, log) => sum + log.userBet, 0)
    const totalProfit = filteredLogs.filter(log => log.winning === 'yes').reduce((sum, log) => sum + (log.profit || 0), 0)
    const totalLoss = filteredLogs.filter(log => log.winning === 'no').reduce((sum, log) => sum + Math.abs(log.profit || 0), 0)
    const failedBetsCount = filteredLogs.filter(log => log.winning === 'failed').length

    return (
        <div className="space-y-5">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">Teen Patti 3 Logs</h1>
                <p className="text-sm text-muted-foreground">Game ID: 16 • View all game rounds and user activity</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Bets</p>
                    <p className="text-xl font-bold text-foreground">₹{totalBets.toLocaleString()}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Profit</p>
                    <p className="text-xl font-bold text-emerald-500">₹{totalProfit.toLocaleString()}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Total Loss</p>
                    <p className="text-xl font-bold text-red-500">₹{totalLoss.toLocaleString()}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Failed Bets</p>
                    <p className="text-xl font-bold text-orange-500">{failedBetsCount}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    {/* User ID Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchUserId}
                            onChange={(e) => { setSearchUserId(e.target.value); setCurrentPage(1); }}
                            placeholder="Search User ID"
                            className="w-full bg-background border border-input rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                        />
                    </div>

                    {/* Winning Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={cn(
                                "flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-lg text-sm font-medium transition-colors outline-none",
                                winningFilter !== 'all' ? "text-primary border-primary/50 bg-primary/5" : "text-muted-foreground hover:bg-accent"
                            )}>
                                <Filter className="w-4 h-4" />
                                Winning: {winningFilter === 'all' ? 'All' : winningFilter.toUpperCase()}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by Winning</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked={winningFilter === 'all'} onCheckedChange={() => setWinningFilter('all')}>All</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={winningFilter === 'yes'} onCheckedChange={() => setWinningFilter('yes')}>Yes</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={winningFilter === 'no'} onCheckedChange={() => setWinningFilter('no')}>No</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={winningFilter === 'failed'} onCheckedChange={() => setWinningFilter('failed')}>Failed</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Rewarded Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className={cn(
                                "flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-lg text-sm font-medium transition-colors outline-none",
                                rewardedFilter !== 'all' ? "text-primary border-primary/50 bg-primary/5" : "text-muted-foreground hover:bg-accent"
                            )}>
                                <Filter className="w-4 h-4" />
                                Rewarded: {rewardedFilter === 'all' ? 'All' : rewardedFilter.toUpperCase()}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by Rewarded</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuCheckboxItem checked={rewardedFilter === 'all'} onCheckedChange={() => setRewardedFilter('all')}>All</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={rewardedFilter === 'yes'} onCheckedChange={() => setRewardedFilter('yes')}>Yes</DropdownMenuCheckboxItem>
                            <DropdownMenuCheckboxItem checked={rewardedFilter === 'no'} onCheckedChange={() => setRewardedFilter('no')}>No</DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Date From */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                            className="w-full bg-background border border-input rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                        />
                    </div>

                    {/* Date To */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                            className="w-full bg-background border border-input rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                        />
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-card border border-border rounded-xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 uppercase tracking-wider font-medium text-xs border-b border-border">
                            <tr>
                                <th className="px-4 py-3 text-foreground">User ID</th>
                                <th className="px-4 py-3 text-foreground">Round ID</th>
                                <th className="px-4 py-3 text-foreground">User Bet</th>
                                <th className="px-4 py-3 text-foreground">Winning</th>
                                <th className="px-4 py-3 text-foreground">Rewarded</th>
                                <th className="px-4 py-3 text-foreground">Profit/Loss</th>
                                <th className="px-4 py-3 text-foreground">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginatedLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-foreground">{log.userId}</span>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">{log.gameRoundId}</td>
                                    <td className="px-4 py-3 font-medium text-foreground">₹{log.userBet.toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        {log.winning === 'yes' && (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                YES
                                            </span>
                                        )}
                                        {log.winning === 'no' && (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                                                NO
                                            </span>
                                        )}
                                        {log.winning === 'failed' && (
                                            <div className="flex flex-col gap-1">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-500 border border-orange-500/20 w-fit">
                                                    FAILED
                                                </span>
                                                <span className="text-xs text-muted-foreground">{log.failedReason}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {log.rewarded ? (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                                YES
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
                                                NO
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {log.winning === 'yes' && (
                                            <span className="font-medium text-emerald-500">+₹{log.profit?.toLocaleString()}</span>
                                        )}
                                        {log.winning === 'no' && (
                                            <span className="font-medium text-red-500">-₹{Math.abs(log.profit || 0).toLocaleString()}</span>
                                        )}
                                        {log.winning === 'failed' && (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-muted-foreground">
                                        {new Date(log.dateTime).toLocaleString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredLogs.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No logs found matching filters
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-auto">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    )
}
