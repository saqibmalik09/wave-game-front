//SocketProvider.tsx
'use client';

import { useEffect } from 'react';
import { getSocket, initSocket } from '@/lib/socket/socketClient';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const socket = getSocket();
    // console.log('[SocketProvider]  Socket initialization started');

    return () => {
      if (socket) {
        socket.disconnect();
        console.log('[SocketProvider] 🔌 Socket disconnected on unmount');
      }
    };
  }, []);

  return <>{children}</>;
}
