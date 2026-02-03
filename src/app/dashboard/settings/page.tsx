'use client'

import { useState } from 'react'
import { Bell, Moon, Lock, Globe, Smartphone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        darkMode: true,
        twoFactor: true,
        publicProfile: false
    })

    // @ts-ignore
    const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-zinc-400">Configure your workspace and preferences.</p>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl divide-y divide-white/5">

                {/* Notifications */}
                <div className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Bell className="w-5 h-5 text-purple-400" />
                        Notifications
                    </h3>
                    <div className="space-y-4">
                        <SettingItem
                            title="Email Notifications"
                            desc="Receive weekly digests and major updates via email."
                            active={settings.emailNotifications}
                            onClick={() => toggle('emailNotifications')}
                        />
                        <SettingItem
                            title="Push Notifications"
                            desc="Get real-time alerts on your mobile device."
                            active={settings.pushNotifications}
                            onClick={() => toggle('pushNotifications')}
                        />
                    </div>
                </div>

                {/* Accessibility & Theme */}
                <div className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Moon className="w-5 h-5 text-blue-400" />
                        Appearance
                    </h3>
                    <SettingItem
                        title="Dark Mode"
                        desc="Use dark theme across the dashboard (Recommended)."
                        active={settings.darkMode}
                        onClick={() => toggle('darkMode')}
                    />
                </div>

                {/* Security */}
                <div className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-emerald-400" />
                        Privacy & Security
                    </h3>
                    <SettingItem
                        title="Two-Factor Authentication"
                        desc="Secure your account with 2FA."
                        active={settings.twoFactor}
                        onClick={() => toggle('twoFactor')}
                    />
                    <SettingItem
                        title="Public Profile"
                        desc="Allow others to see your profile details."
                        active={settings.publicProfile}
                        onClick={() => toggle('publicProfile')}
                    />
                </div>

            </div>
        </div>
    )
}

function SettingItem({ title, desc, active, onClick }: any) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="font-medium text-zinc-200">{title}</p>
                <p className="text-sm text-zinc-500">{desc}</p>
            </div>
            <button
                onClick={onClick}
                className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-2 focus:ring-offset-zinc-950",
                    active ? "bg-purple-600" : "bg-zinc-700"
                )}
            >
                <span
                    className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        active ? "translate-x-6" : "translate-x-1"
                    )}
                />
            </button>
        </div>
    )
}
