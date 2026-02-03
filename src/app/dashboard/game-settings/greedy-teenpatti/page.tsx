'use client'

import { useState } from 'react'
import { Save, Trash2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function GreedyTeenPattiSettings() {
    const [maxBet, setMaxBet] = useState(500000)
    const [winningMultiplier, setWinningMultiplier] = useState({
        "1": 10,
        "2": 15,
        "3": 25,
        "4": 45,
        "5": 5,
        "6": 5,
        "7": 5,
        "8": 5
    })
    const [winningPercentage, setWinningPercentage] = useState({
        "1": 12,
        "2": 12,
        "3": 12,
        "4": 10,
        "5": 12,
        "6": 14,
        "7": 14,
        "8": 14
    })
    const [showClearDialog, setShowClearDialog] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const handleMultiplierChange = (key: string, value: number) => {
        setWinningMultiplier(prev => ({ ...prev, [key]: value }))
    }

    const handlePercentageChange = (key: string, value: number) => {
        setWinningPercentage(prev => ({ ...prev, [key]: value }))
    }

    const handleSaveSettings = async () => {
        setIsSaving(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Saving settings:', { maxBet, winningMultiplier, winningPercentage })
        setIsSaving(false)
    }

    const handleClearRecords = async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('Clearing records...')
        setShowClearDialog(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">Greedy Teen Patti Settings</h1>
                    <p className="text-sm text-muted-foreground">Configure game parameters and probabilities</p>
                </div>
                <button
                    onClick={handleClearRecords}
                    className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium transition-all hover:bg-destructive/20 border border-destructive/20 shrink-0"
                >
                    <Trash2 className="w-4 h-4" />
                    Reset Records
                </button>
            </div>

            {/* Max Bet Configuration */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Max Bet Configuration
                </h3>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Maximum Bet Allowed</label>
                    <input
                        type="number"
                        value={maxBet}
                        onChange={(e) => setMaxBet(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    />
                    <p className="text-xs text-muted-foreground">Default: 500,000</p>
                </div>
            </div>

            {/* Winning Multiplier Editor */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Winning Multiplier
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(winningMultiplier).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Position {key}</label>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => handleMultiplierChange(key, Number(e.target.value))}
                                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Winning Percentage Editor */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    Winning Percentage
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Values represent percentage out of 100
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(winningPercentage).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Position {key}</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => handlePercentageChange(key, Number(e.target.value))}
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className={cn(
                        "flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all hover:bg-primary/90 shadow-md hover:shadow-lg",
                        isSaving && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Settings'}
                </button>

                <button
                    onClick={() => setShowClearDialog(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-muted text-foreground rounded-lg text-sm font-medium transition-all hover:bg-muted/80 border border-border"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                </button>
            </div>

            {/* Clear Records Confirmation Dialog */}
            {showClearDialog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-lg font-bold text-foreground mb-2">Clear All Records?</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            This action cannot be undone. All game records for Greedy Teen Patti will be permanently deleted.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleClearRecords}
                                className="flex-1 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg font-medium transition-all hover:bg-destructive/90"
                            >
                                Yes, Clear Records
                            </button>
                            <button
                                onClick={() => setShowClearDialog(false)}
                                className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-lg font-medium transition-all hover:bg-muted/80"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
