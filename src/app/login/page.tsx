'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { login, clearError } from '@/lib/redux/slices/authSlice'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard')
        }
    }, [isAuthenticated, router])

    useEffect(() => {
        return () => {
            dispatch(clearError())
        }
    }, [dispatch])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        const result = await dispatch(login({ email, password }))

        if (login.fulfilled.match(result)) {
            router.push('/dashboard')
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden transition-colors duration-300">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm p-8 bg-card/80 backdrop-blur-xl border border-border rounded-xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-6">
                    <div className="inline-flex justify-center items-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 mb-4 shadow-lg shadow-primary/20">
                        <span className="font-bold text-white text-xl">W</span>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground text-xs mt-1">
                        Sign in to access your dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@wavegames.com"
                                    disabled={loading}
                                    className="w-full bg-background/50 border border-input focus:border-primary/50 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all ring-0 focus:ring-2 focus:ring-primary/10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="w-full bg-background/50 border border-input focus:border-primary/50 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all ring-0 focus:ring-2 focus:ring-primary/10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-500">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-xs text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Register here
                        </Link>
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                        Default: superadmin@wavegames.com / Admin@123
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
