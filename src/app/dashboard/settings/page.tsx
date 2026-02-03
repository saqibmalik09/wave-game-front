'use client'

import { useState } from 'react'
import { Bell, Moon, Lock, Globe, Smartphone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        emailNotifications: true,
        pushNotifications: false,
        twoFactor: true,
        publicProfile: false
    })

    // @ts-ignore
    const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }))

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
                <p className="text-muted-foreground">Configure your workspace and preferences.</p>
            </div>

            <div className="bg-card border border-border rounded-2xl divide-y divide-border shadow-sm">

                {/* Notifications */}
                <div className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
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
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Moon className="w-5 h-5 text-blue-500" />
                        Appearance
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Theme Preference</p>
                            <p className="text-sm text-muted-foreground">Toggle between Light and Dark modes.</p>
                        </div>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Security */}
                <div className="p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Lock className="w-5 h-5 text-emerald-500" />
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
                <p className="font-medium text-foreground">{title}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            <button
                onClick={onClick}
                className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
                    active ? "bg-primary" : "bg-input"
                )}
            >
                <span
                    className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-background transition-transform",
                        active ? "translate-x-6" : "translate-x-1"
                    )}
                />
            </button>
        </div>
    )
}
