'use client';

import { useEffect } from 'react';
import { initSocket } from '@/lib/socket/socketClient';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const socket = initSocket();
    // console.log('[SocketProvider] 🚀 Socket initialization started');

    return () => {
      if (socket) {
        socket.disconnect();
        console.log('[SocketProvider] 🔌 Socket disconnected on unmount');
      }
    };
  }, []);

  return <>{children}</>;
}
