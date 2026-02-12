'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Phone, Loader2, Check, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { register, login, clearError } from '@/lib/redux/slices/authSlice'
import Link from 'next/link'

export default function RegisterPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        nickname: '',
        phone_number: '',
    })

    const [passwordStrength, setPasswordStrength] = useState({
        hasLength: false,
        hasUpper: false,
        hasLower: false,
        hasNumber: false,
    })

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

    // Password strength check
    useEffect(() => {
        setPasswordStrength({
            hasLength: formData.password.length >= 8,
            hasUpper: /[A-Z]/.test(formData.password),
            hasLower: /[a-z]/.test(formData.password),
            hasNumber: /\d/.test(formData.password),
        })
    }, [formData.password])

    const isPasswordValid = Object.values(passwordStrength).every(Boolean)
    const doPasswordsMatch = formData.password === formData.confirmPassword

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isPasswordValid) return
        if (!doPasswordsMatch) return

        const { confirmPassword, ...registerData } = formData

        const result = await dispatch(register(registerData))

        if (register.fulfilled.match(result)) {
            // Auto-login after successful registration
            const loginResult = await dispatch(login({
                email: formData.email,
                password: formData.password,
            }))

            if (login.fulfilled.match(loginResult)) {
                router.push('/dashboard')
            }
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground relative overflow-hidden transition-colors duration-300 py-8">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 bg-card/80 backdrop-blur-xl border border-border rounded-xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-6">
                    <div className="inline-flex justify-center items-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 mb-4 shadow-lg shadow-primary/20">
                        <span className="font-bold text-white text-xl">W</span>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                        Create Account
                    </h1>
                    <p className="text-muted-foreground text-xs mt-1">
                        Join WaveGame platform today
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-3">
                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Email *</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                    disabled={loading}
                                    className="w-full bg-background/50 border border-input focus:border-primary/50 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all ring-0 focus:ring-2 focus:ring-primary/10 shadow-sm disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Full Name *</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    disabled={loading}
                                    className="w-full bg-background/50 border border-input focus:border-primary/50 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all ring-0 focus:ring-2 focus:ring-primary/10 shadow-sm disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Nickname (Optional) */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Nickname</label>
                            <input
                                type="text"
                                value={formData.nickname}
                                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                placeholder="Optional"
                                disabled={loading}
                                className="w-full bg-background/50 border border-input focus:border-primary/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all ring-0 focus:ring-2 focus:ring-primary/10 shadow-sm disabled:opacity-50"
                            />
                        </div>

                        {/* Phone (Optional) */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="tel"
                                    value={formData.phone_number}
                                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                    placeholder="Optional"
                                    disabled={loading}
                                    className="w-full bg-background/50 border border-input focus:border-primary/50 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all ring-0 focus:ring-2 focus:ring-primary/10 shadow-sm disabled:opacity-50"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Password *</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="w-full bg-background/50 border border-input focus:border-primary/50 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all ring-0 focus:ring-2 focus:ring-primary/10 shadow-sm disabled:opacity-50"
                                />
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2 space-y-1 text-xs">
                                    <div className={`flex items-center gap-1 ${passwordStrength.hasLength ? 'text-green-500' : 'text-muted-foreground'}`}>
                                        {passwordStrength.hasLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        <span>At least 8 characters</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordStrength.hasUpper ? 'text-green-500' : 'text-muted-foreground'}`}>
                                        {passwordStrength.hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        <span>One uppercase letter</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordStrength.hasLower ? 'text-green-500' : 'text-muted-foreground'}`}>
                                        {passwordStrength.hasLower ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        <span>One lowercase letter</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-green-500' : 'text-muted-foreground'}`}>
                                        {passwordStrength.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                        <span>One number</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground ml-1">Confirm Password *</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="w-full bg-background/50 border border-input focus:border-primary/50 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all ring-0 focus:ring-2 focus:ring-primary/10 shadow-sm disabled:opacity-50"
                                />
                            </div>
                            {formData.confirmPassword && !doPasswordsMatch && (
                                <p className="text-xs text-red-500 ml-1">Passwords do not match</p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-xs text-red-500">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !isPasswordValid || !doPasswordsMatch}
                        className="w-full h-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground text-sm font-medium rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Creating account...</span>
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
