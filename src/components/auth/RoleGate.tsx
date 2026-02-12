'use client';

import { useAppSelector } from '@/lib/redux/hooks';

interface RoleGateProps {
    roles: number[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function RoleGate({
    roles,
    children,
    fallback = null,
}: RoleGateProps) {
    const { roleIds } = useAppSelector((state) => state.auth);

    // No roles required
    if (roles.length === 0) {
        return <>{children}</>;
    }

    // Check if user has any of the required roles
    const hasRole = roles.some((roleId) => roleIds.includes(roleId));

    if (hasRole) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
