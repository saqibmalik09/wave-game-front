'use client';

import { io, Socket } from 'socket.io-client';
import { setCache, getCache } from '@/lib/cache';
import { v4 as uuidv4 } from 'uuid';
const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL;
const APPLICATION_INFO_KEY = 'applicationInfo';
const USERID_KEY = 'userId';
let userId=getCache(USERID_KEY)
if(!userId){
 userId = uuidv4();
setCache(USERID_KEY, userId);
}
let socket: Socket | null = null;

/**
 * Initialize socket with userId as query param
 */
export const initSocket = (): Socket => {
  if (socket && socket.connected) {
    setCache(APPLICATION_INFO_KEY, { socketId: socket.id! });
    return socket;
  }

  if (socket && !socket.connected) {
    socket.connect();
    return socket;
  }

  // Pass userId in query
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    autoConnect: true,
    query: {
      userId:userId, // <-- this will be accessible on server via client.handshake.query.userId
    },
  });

  socket.on('connect', () => {
    setCache(APPLICATION_INFO_KEY, { socketId: socket?.id! });
    // console.log('[SocketClient] ✅ Connected with id:', socket?.id);
  });

  socket.on('reconnect', () => {
    setCache(APPLICATION_INFO_KEY, { socketId: socket?.id! });
  });

  socket.on('connect_error', () => {
    // console.error('[SocketClient] Connection error:', err.message);
  });

  socket.on('disconnect', () => {
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
