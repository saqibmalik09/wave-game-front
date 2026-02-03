'use client'

import { useState } from 'react'
import { Search, Filter, MoreHorizontal, Gamepad2, Plus, X, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [search, setSearch] = useState('')

    // New Game Form State
    const [newGame, setNewGame] = useState({ name: '', category: 'Action' })

    const toggleStatus = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
        setGames(games.map(game =>
            game.id === id ? { ...game, status: newStatus } : game
        ))
        toast.success(`Game status updated to ${newStatus}`)
    }

    const handleAddGame = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newGame.name) return

        const game: Game = {
            id: `GM-${Math.floor(Math.random() * 1000)}`,
            name: newGame.name,
            category: newGame.category,
            players: 0,
            status: 'inactive',
            lastUpdated: 'Just now'
        }

        setGames([game, ...games])
        setIsModalOpen(false)
        setNewGame({ name: '', category: 'Action' })
        toast.success("Game added successfully!")
    }

    const handleDelete = (id: string) => {
        setGames(games.filter(g => g.id !== id))
        toast.error("Game deleted")
    }

    const filteredGames = games.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Games Management</h1>
                    <p className="text-muted-foreground">Manage game availability, configurations and status.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-4 py-2.5 rounded-xl font-medium transition-all shadow-md shadow-primary/20 hover:scale-105 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Add New Game
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search games..."
                        className="w-full bg-card border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-foreground"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-input rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Games List */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-muted-foreground">
                        <thead className="bg-muted/50 uppercase tracking-wider font-medium text-xs border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-foreground">Game Name</th>
                                <th className="px-6 py-4 text-foreground">Category</th>
                                <th className="px-6 py-4 text-foreground">Active Players</th>
                                <th className="px-6 py-4 text-foreground">Status</th>
                                <th className="px-6 py-4 text-foreground">Last Updated</th>
                                <th className="px-6 py-4 text-right text-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredGames.map((game) => (
                                <tr key={game.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-blue-500/10 border border-border flex items-center justify-center">
                                                <Gamepad2 className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{game.name}</p>
                                                <p className="text-xs text-muted-foreground">{game.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                                            {game.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 tabular-nums">
                                        {game.players.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleStatus(game.id, game.status)}
                                            className={cn(
                                                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
                                                game.status === 'active' ? "bg-primary" : "bg-input"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                                                    game.status === 'active' ? "translate-x-6" : "translate-x-1"
                                                )}
                                            />
                                        </button>
                                        <span className="ml-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            {game.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {game.lastUpdated}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors outline-none">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => toast.info(`Editing ${game.name}`)}>
                                                    Edit Configuration
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => toggleStatus(game.id, game.status)}>
                                                    {game.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => handleDelete(game.id)}>
                                                    Delete Game
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">Add New Game</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddGame} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Game Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newGame.name}
                                    onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="e.g. Poker Deluxe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Category</label>
                                <select
                                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                    value={newGame.category}
                                    onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}
                                >
                                    <option>Action</option>
                                    <option>Card</option>
                                    <option>Strategy</option>
                                    <option>Arcade</option>
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-input rounded-lg text-sm font-medium hover:bg-accent transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Game
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
