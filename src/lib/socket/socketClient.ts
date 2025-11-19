'use client';

import { io, Socket } from 'socket.io-client';

// 🔗 Socket server URL
const SOCKET_URL =
  process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL || 'http://127.0.0.1:4005';

// 🧠 Persistent socket instance (singleton)
let socket: Socket | null = null;

/**
 * Initialize or reuse the existing socket connection.
 * Ensures one socket ID per user (singleton connection).
 */
export const initSocket = (): Socket => {
  // If socket already exists and is connected — reuse it
  if (socket && socket.connected) {
    // console.log('[SocketClient] ♻️ Using existing connected socket:', socket.id);
    return socket;
  }

  // If socket exists but disconnected — reconnect it
  if (socket && !socket.connected) {
    // console.log('[SocketClient] 🔄 Reconnecting socket...');
    socket.connect();
    return socket;
  }

  // If no socket yet, create new connection
  // console.log('[SocketClient] 🔌 Creating new socket connection...');
  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    autoConnect: true,
  });

  // ✅ Connection established
  socket.on('connect', () => {
    // console.log(`[SocketClient] ✅ Connected to ${SOCKET_URL} with id: ${socket?.id}`);
  });

  // ⚠️ Handle connection errors
  socket.on('connect_error', (err) => {
    console.error('[SocketClient] ❌ Connection error:', err.message);
  });

  // 🔌 Handle disconnection
  socket.on('disconnect', (reason) => {
    console.warn('[SocketClient] ⚠️ Disconnected:', reason);
  });

  return socket;
};

/**
 * Export the shared socket (for read-only access if needed)
 */
export const getSocket = (): Socket | null => socket;

export default initSocket;
