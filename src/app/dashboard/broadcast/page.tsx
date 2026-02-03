'use client'

import { useState } from 'react'
import { Megaphone, Send, AlertCircle, CheckCircle2, Globe, Gamepad2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Game Configuration
const games = [
    { id: 'all', name: 'All Games', icon: Globe },
    { id: '1', name: 'Greedy (ID: 1)', icon: Gamepad2 },
    { id: '3', name: 'Fruit Game (ID: 3)', icon: Gamepad2 },
    { id: '16', name: 'TeenPatti (ID: 16)', icon: Gamepad2 },
    // Generate other IDs
    ...Array.from({ length: 16 }, (_, i) => i + 1)
        .filter(id => ![1, 3, 16].includes(id))
        .map(id => ({ id: id.toString(), name: `Game ID ${id}`, icon: Gamepad2 }))
        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
]

export default function BroadcastPage() {
    const [selectedGame, setSelectedGame] = useState('all')
    const [message, setMessage] = useState('')
    const [isSending, setIsSending] = useState(false)

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) {
            toast.error("Please enter a message")
            return
        }

        setIsSending(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        const targetName = games.find(g => g.id === selectedGame)?.name || 'Unknown Game'

        toast.success(`Message sent to ${targetName} players`, {
            description: "Notification has been queued for delivery."
        })

        setMessage('')
        setIsSending(false)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Game Broadcast</h1>
                <p className="text-muted-foreground">Send real-time notifications to players in specific games.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <form onSubmit={handleSend} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Target Audience</label>
                                <div className="relative">
                                    <select
                                        value={selectedGame}
                                        onChange={(e) => setSelectedGame(e.target.value)}
                                        className="w-full appearance-none bg-background border border-input rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="all">All Games (Global Broadcast)</option>
                                        <optgroup label="Featured Games">
                                            <option value="1">Greedy (ID: 1)</option>
                                            <option value="3">Fruit Game (ID: 3)</option>
                                            <option value="16">TeenPatti (ID: 16)</option>
                                        </optgroup>
                                        <optgroup label="Other Games">
                                            {games
                                                .filter(g => !['all', '1', '3', '16'].includes(g.id))
                                                .sort((a, b) => parseInt(a.id) - parseInt(b.id))
                                                .map(g => (
                                                    <option key={g.id} value={g.id}>{g.name}</option>
                                                ))
                                            }
                                        </optgroup>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                        <Gamepad2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Select which game's active players will receive this message.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Notification Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here... (e.g. 'Server maintenance in 10 minutes', 'New bonus event started!')"
                                    className="w-full min-h-[150px] bg-background border border-input rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-y"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Supports basic text only</span>
                                    <span>{message.length} characters</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSending || !message.trim()}
                                    className={cn(
                                        "w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100",
                                        isSending && "animate-pulse"
                                    )}
                                >
                                    {isSending ? (
                                        <>Broadcasting...</>
                                    ) : (
                                        <>
                                            <Megaphone className="w-5 h-5" />
                                            Send Broadcast
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Side Info */}
                <div className="space-y-6">
                    <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                <AlertCircle className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium text-foreground mb-1">Important Note</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Broadcast messages are delivered instantly to all active connected players. Please use this feature responsibly.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            System Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Push Service</span>
                                <span className="flex items-center gap-1.5 text-green-500 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Online
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Active Connections</span>
                                <span className="text-foreground font-mono">12,450</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Queue Size</span>
                                <span className="text-foreground font-mono">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
