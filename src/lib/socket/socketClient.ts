'use client';

import { io, Socket } from 'socket.io-client';
import { setCache, getCache } from '@/lib/cache';

const SOCKET_URL =
  process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL || 'http://127.0.0.1:4005';

const APPLICATION_INFO_KEY = 'applicationInfo';

let socket: Socket | null = null;

export const initSocket = (): Socket => {
  if (socket && socket.connected) {
    setCache(APPLICATION_INFO_KEY, { socketId: socket.id! });
    // console.log('[SocketClient] ♻️ Using existing connected socket:', socket.id);
    return socket;
  }

  if (socket && !socket.connected) {
    socket.connect();
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    autoConnect: true,
  });

  socket.on('connect', () => {
    setCache(APPLICATION_INFO_KEY, { socketId: socket?.id! });
    // console.log('[SocketClient] ✅ Connected with id:', socket?.id);
  });

  socket.on('reconnect', () => {
    setCache(APPLICATION_INFO_KEY, { socketId: socket?.id! });
    // console.log('[SocketClient] 🔄 Reconnected with  id:', socket?.id);
  });

  socket.on('connect_error', (err) => {
    // console.error('[SocketClient]  Connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    // console.warn('[SocketClient] ⚠️ Disconnected:', reason);
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

/**
 * Get application info from cache (RAM/localStorage)
 */
export const getApplicationInfo = () => {
  return getCache(APPLICATION_INFO_KEY);
};

export default initSocket;
