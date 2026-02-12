'use client';

import { useAppSelector } from '@/lib/redux/hooks';
import { RoleId } from '@/lib/types/auth.types';

interface PermissionGateProps {
    permissions: string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
    requireAll?: boolean;
}

export default function PermissionGate({
    permissions,
    children,
    fallback = null,
    requireAll = false,
}: PermissionGateProps) {
    const { permissions: userPermissions, roleIds } = useAppSelector((state) => state.auth);

    // Superadmin bypasses all permission checks
    if (roleIds.includes(RoleId.SUPERADMIN)) {
        return <>{children}</>;
    }

    // No permissions required
    if (permissions.length === 0) {
        return <>{children}</>;
    }

    // Check permissions
    const hasPermission = requireAll
        ? permissions.every((perm) => userPermissions.includes(perm))
        : permissions.some((perm) => userPermissions.includes(perm));

    if (hasPermission) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
