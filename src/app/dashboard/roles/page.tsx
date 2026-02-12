'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Plus, Edit, Trash2, Loader2, Users, Key } from 'lucide-react'
import { toast } from 'sonner'
import RoleGate from '@/components/auth/RoleGate'
import { RoleId, type Role, type Permission } from '@/lib/types/auth.types'
import { RolesAPI, PermissionsAPI } from '@/lib/api/api'

export default function RolesPage() {
    const router = useRouter()
    const [roles, setRoles] = useState<Role[]>([])
    const [permissions, setPermissions] = useState<Permission[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        permissionIds: [] as number[],
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const [rolesData, permissionsData] = await Promise.all([
                RolesAPI.getAllRoles(),
                PermissionsAPI.getAllPermissions(),
            ])
            setRoles(rolesData)
            setPermissions(permissionsData)
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await RolesAPI.createRole(formData)
            toast.success('Role created successfully!')
            setShowCreateModal(false)
            setFormData({ name: '', description: '', permissionIds: [] })
            fetchData()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create role')
        }
    }

    const handlePermissionToggle = (permissionId: number) => {
        setFormData(prev => ({
            ...prev,
            permissionIds: prev.permissionIds.includes(permissionId)
                ? prev.permissionIds.filter(id => id !== permissionId)
                : [...prev.permissionIds, permissionId]
        }))
    }

    return (
        <RoleGate roles={[RoleId.SUPERADMIN]} fallback={
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Shield className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
                <p className="text-muted-foreground mb-6">You don't have permission to access this page.</p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Go to Dashboard
                </button>
            </div>
        }>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Roles & Permissions</h1>
                        <p className="text-muted-foreground mt-1">Manage user roles and their permissions</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Create Role
                    </button>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {roles.map((role) => (
                            <div
                                key={role.id}
                                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">{role.name}</h3>
                                            <p className="text-xs text-muted-foreground">ID: {role.id}</p>
                                        </div>
                                    </div>
                                </div>

                                {role.description && (
                                    <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Key className="w-4 h-4" />
                                        <span>{role.permissions?.length || 0} permissions</span>
                                    </div>
                                </div>

                                {role.permissions && role.permissions.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Permissions:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions.slice(0, 3).map((perm) => (
                                                <span
                                                    key={perm.id}
                                                    className="px-2 py-1 bg-primary/10 text-primary text-[10px] rounded-md"
                                                >
                                                    {perm.name}
                                                </span>
                                            ))}
                                            {role.permissions.length > 3 && (
                                                <span className="px-2 py-1 bg-muted text-muted-foreground text-[10px] rounded-md">
                                                    +{role.permissions.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Role Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Create New Role</h2>

                            <form onSubmit={handleCreateRole} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">
                                        Role Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Content Manager"
                                        className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground mb-1 block">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of this role..."
                                        rows={3}
                                        className="w-full bg-background border border-input rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                        Permissions
                                    </label>
                                    <div className="max-h-60 overflow-y-auto border border-border rounded-lg p-3 space-y-2">
                                        {permissions.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.permissionIds.includes(permission.id)}
                                                    onChange={() => handlePermissionToggle(permission.id)}
                                                    className="w-4 h-4 text-primary border-border rounded focus:ring-2 focus:ring-primary/20"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-foreground">{permission.name}</p>
                                                    {permission.description && (
                                                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false)
                                            setFormData({ name: '', description: '', permissionIds: [] })
                                        }}
                                        className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        Create Role
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </RoleGate>
    )
}
