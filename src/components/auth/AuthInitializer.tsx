'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { restoreAuth, getCurrentUser } from '@/lib/redux/slices/authSlice';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Restore auth from localStorage
        dispatch(restoreAuth());

        // Fetch current user if tokens exist
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            dispatch(getCurrentUser());
        }
    }, [dispatch]);

    return <>{children}</>;
}
