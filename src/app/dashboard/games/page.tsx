'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, MoreHorizontal, Gamepad2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Game {
    id: string
    name: string
    category: string
    players: number
    status: 'active' | 'inactive'
    lastUpdated: string
}

const initialGames: Game[] = [
    { id: 'GM-001', name: 'Cyber Racer 2077', category: 'Racing', players: 1240, status: 'active', lastUpdated: '2h ago' },
    { id: 'GM-002', name: 'Space Invaders Redux', category: 'Arcade', players: 850, status: 'active', lastUpdated: '5h ago' },
    { id: 'GM-003', name: 'Mystic Puzzle', category: 'Puzzle', players: 320, status: 'inactive', lastUpdated: '1d ago' },
    { id: 'GM-004', name: 'Battle Royale X', category: 'Action', players: 15400, status: 'active', lastUpdated: '10m ago' },
    { id: 'GM-005', name: 'Chess Master', category: 'Strategy', players: 2100, status: 'active', lastUpdated: '3d ago' },
]

export default function GamesPage() {
    const [games, setGames] = useState<Game[]>(initialGames)
    const [filter, setFilter] = useState('')

    const toggleStatus = (id: string) => {
        setGames(games.map(game => {
            if (game.id === id) {
                return { ...game, status: game.status === 'active' ? 'inactive' : 'active' }
            }
            return game
        }))
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Games Management</h1>
                    <p className="text-zinc-400">Manage game availability and settings.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-purple-900/20">
                    <Plus className="w-5 h-5" />
                    Add New Game
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search games..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 text-zinc-200"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Games List */}
            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-white/5 uppercase tracking-wider font-medium text-xs">
                            <tr>
                                <th className="px-6 py-4 text-zinc-300">Game Name</th>
                                <th className="px-6 py-4 text-zinc-300">Category</th>
                                <th className="px-6 py-4 text-zinc-300">Active Players</th>
                                <th className="px-6 py-4 text-zinc-300">Status</th>
                                <th className="px-6 py-4 text-zinc-300">Last Updated</th>
                                <th className="px-6 py-4 text-right text-zinc-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {games.map((game) => (
                                <tr key={game.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                                                <Gamepad2 className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{game.name}</p>
                                                <p className="text-xs text-zinc-500">{game.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-white/5">
                                            {game.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-300 tabular-nums">
                                        {game.players.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(game.id)}
                                            className={cn(
                                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2 focus:ring-offset-zinc-950",
                                                game.status === 'active' ? "bg-purple-600" : "bg-zinc-700"
                                            )}
                                        >
                                            <span className="sr-only">Enable notifications</span>
                                            <span
                                                className={cn(
                                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                    game.status === 'active' ? "translate-x-6" : "translate-x-1"
                                                )}
                                            />
                                        </button>
                                        <span className="ml-2 text-xs font-medium uppercase tracking-wider">
                                            {game.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {game.lastUpdated}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
