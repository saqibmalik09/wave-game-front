'use client'

import { useState } from 'react'
import { Search, Filter, MoreHorizontal, Download, User as UserIcon, Coins, X, Save } from 'lucide-react'
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
import { exportToExcel } from '@/lib/export'

// Mock Data
const usersData = Array.from({ length: 20 }).map((_, i) => ({
    id: `USR-${1000 + i}`,
    username: `player_${1000 + i}`,
    email: `player${1000 + i}@example.com`,
    betAmount: Math.floor(Math.random() * 50000),
    status: Math.random() > 0.2 ? 'active' : 'suspended',
    joinDate: '2025-10-24'
}))

export default function UsersPage() {
    const [users, setUsers] = useState(usersData)
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newUser, setNewUser] = useState({ username: '', email: '' })

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.id.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleAction = (action: string, userId: string) => {
        toast.success(`${action} action triggered for ${userId}`)
    }

    const handleExport = () => {
        exportToExcel(users, 'User_Data_Export')
        toast.success("User data exported successfully")
    }

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newUser.username || !newUser.email) {
            toast.error("Please fill all fields")
            return
        }

        const userEntry = {
            id: `USR-${Math.floor(Math.random() * 9000) + 1000}`,
            username: newUser.username,
            email: newUser.email,
            betAmount: 0,
            status: 'active',
            joinDate: new Date().toISOString().split('T')[0]
        }

        // @ts-ignore
        setUsers([userEntry, ...users])
        setIsModalOpen(false)
        setNewUser({ username: '', email: '' })
        toast.success("User added successfully")
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
                    <p className="text-muted-foreground">Manage registered players and view their betting history.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-500 hover:to-emerald-500 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export Excel
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
                    >
                        <UserIcon className="w-4 h-4" />
                        Add User
                    </button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative flex-1 w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search users by ID, username or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-background border border-input rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{filteredUsers.length}</span> users
                    </div>
                    <div className="h-4 w-px bg-border hidden sm:block"></div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-background border border-input rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                        <Filter className="w-3.5 h-3.5" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b border-border uppercase tracking-wider font-medium text-xs text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Join Date</th>
                                <th className="px-6 py-4">Total Bet Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-xs">
                                                {user.username.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{user.username}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                                <p className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {user.joinDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                                            <Coins className="w-3.5 h-3.5 text-yellow-500" />
                                            ${user.betAmount.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                            user.status === 'active'
                                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                                : "bg-red-500/10 text-red-500 border-red-500/20"
                                        )}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", user.status === 'active' ? "bg-green-500" : "bg-red-500")} />
                                            {user.status === 'active' ? 'Active' : 'Suspended'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors outline-none">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleAction('View Details', user.id)}>
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleAction('Edit Balance', user.id)}>
                                                    Edit Balance
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={() => handleAction('Suspend User', user.id)}>
                                                    Suspend Account
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            No users found matching "{search}"
                        </div>
                    )}
                </div>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">Add New User</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="e.g. jondoe_99"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="e.g. jon@example.com"
                                />
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
                                    Save User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
