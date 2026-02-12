/**
 * Authentication Type Definitions
 * Matches backend API response structure
 */

export interface User {
    id: number;
    email: string;
    name: string;
    nickname?: string;
    phone_number?: string;
    firebase_device_id?: string;
    tenant_id?: string;
    status: 'active' | 'inactive' | 'blocked' | 'restricted' | 'deleted' | 'pending';
    beans?: number;
    coins?: number;
    roles: Role[];
    permissions?: Permission[];
    created_at: string;
    updated_at: string;
    last_login_attempt?: string;
}

export interface Role {
    id: number;
    name: string;
    description?: string;
    permissions?: Permission[];
    created_at?: string;
    updated_at?: string;
}

export interface Permission {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    nickname?: string;
    phone_number?: string;
    firebase_device_id?: string;
    tenant_id?: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

export interface LoginResponse {
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
}

export interface RegisterResponse {
    message: string;
    user: User;
}

export interface CreateRoleDto {
    name: string;
    description?: string;
    permissionIds?: number[];
}

export interface CreatePermissionDto {
    name: string;
    description?: string;
}

export interface AssignPermissionsDto {
    permissionIds: number[];
}

export interface AssignRolesDto {
    roleIds: number[];
}

export interface ApiErrorResponse {
    message: string;
    error?: string;
    statusCode: number;
}

// Role IDs (matching backend)
export enum RoleId {
    SUPERADMIN = 1,
    ADMIN = 2,
    AGENCY = 3,
    HOST = 4,
    USER = 5,
    PLAYER = 6,
    DEVELOPER = 7,
}

// Common permissions (matching backend)
export const PERMISSIONS = {
    // Users
    USERS_CREATE: 'users.create',
    USERS_READ: 'users.read',
    USERS_UPDATE: 'users.update',
    USERS_DELETE: 'users.delete',
    USERS_MANAGE: 'users.manage',

    // Roles
    ROLES_CREATE: 'roles.create',
    ROLES_READ: 'roles.read',
    ROLES_UPDATE: 'roles.update',
    ROLES_DELETE: 'roles.delete',
    ROLES_MANAGE: 'roles.manage',

    // Permissions
    PERMISSIONS_CREATE: 'permissions.create',
    PERMISSIONS_READ: 'permissions.read',
    PERMISSIONS_UPDATE: 'permissions.update',
    PERMISSIONS_DELETE: 'permissions.delete',
    PERMISSIONS_MANAGE: 'permissions.manage',

    // Games
    GAMES_CREATE: 'games.create',
    GAMES_READ: 'games.read',
    GAMES_UPDATE: 'games.update',
    GAMES_DELETE: 'games.delete',
    GAMES_MANAGE: 'games.manage',

    // Wallet
    WALLET_CREATE: 'wallet.create',
    WALLET_READ: 'wallet.read',
    WALLET_UPDATE: 'wallet.update',
    WALLET_DELETE: 'wallet.delete',
    WALLET_MANAGE: 'wallet.manage',

    // Settings
    SETTINGS_CREATE: 'settings.create',
    SETTINGS_READ: 'settings.read',
    SETTINGS_UPDATE: 'settings.update',
    SETTINGS_DELETE: 'settings.delete',
    SETTINGS_MANAGE: 'settings.manage',

    // Broadcasts
    BROADCASTS_CREATE: 'broadcasts.create',
    BROADCASTS_READ: 'broadcasts.read',
    BROADCASTS_UPDATE: 'broadcasts.update',
    BROADCASTS_DELETE: 'broadcasts.delete',
    BROADCASTS_MANAGE: 'broadcasts.manage',
} as const;
