'use client';

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL;

let socket: Socket | null = null;
let userIdGlobal: string | null = null;
let appKeyGlobal: string | null = null;
let gameIdGlobal: string | null = null;
let nameGlobal: string | null = null;
let profilePictureGlobal: string | null = null;
let tokenGlobal: string | null = null;
let isInitializing = false;

interface InitSocketOptions {
  userId: string;
  appKey: string;
  gameId: string;
  name: string;
  profilePicture: string;
  token: string;
}

/**
 * Initialize the socket.
 * Must provide userId, appKey, token.
 * If already initialized with same credentials, returns existing socket.
 */
export const initSocket = ({ userId, appKey,gameId, name, profilePicture, token }: InitSocketOptions): Socket => {

  if (!userId || !appKey || !name || !profilePicture || !gameId) {
    throw new Error('[Socket] Cannot initialize: missing userId, appKey, or token');
  }

  // If socket already exists and is connected with same credentials, just return it
  if (socket && socket.connected && 
      userIdGlobal === userId && 
      appKeyGlobal === appKey && 
      gameIdGlobal === gameId &&
      tokenGlobal === token) {
    console.log("Socket already connected, reusing:", socket.id);
    return socket;
  }

  // Prevent multiple simultaneous initializations
  if (isInitializing && socket) {
    console.log("Socket initialization already in progress, returning existing socket");
    return socket;
  }

  isInitializing = true;

  // Clean up existing socket if it exists (even if not connected)
  if (socket) {
    console.log("Cleaning up existing socket before creating new one");
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  // Update global credentials
  userIdGlobal = userId;
  appKeyGlobal = appKey;
  gameIdGlobal = gameId;
  nameGlobal = name;
  profilePictureGlobal = profilePicture;
  tokenGlobal = token;

  // Create new socket connection
  console.log('Initializing new socket connection...');
  socket = io(SOCKET_URL!, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 30,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,  
    randomizationFactor: 0.5,
    timeout: 15000,
    query: { userId, appKey, name, profilePicture, token,gameId },
  });

  // Add event listeners only once
  socket.on('connect', () => {
    console.log(' Socket Connected:', socket?.id);
    isInitializing = false;
  });

  socket.on('reconnect', () => {
    console.log(' Socket Reconnected:', socket?.id);
    isInitializing = false;
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message);
    isInitializing = false;
  });

  socket.on('disconnect', (reason) => {
    console.warn('[Socket] Disconnected:', reason);
    isInitializing = false;
  });

  // Handle connection timeout
  if (!socket.connected) {
    setTimeout(() => {
      if (socket && !socket.connected) {
        console.warn('[Socket] Connection timeout, attempting to connect...');
        socket.connect();
      }
    }, 500);
  } else {
    console.log('Socket already connected:', socket.id);
    isInitializing = false;
  }

  return socket;
};

/**
 * Returns the socket instance if already initialized.
 * Returns null if socket doesn't exist or is not initialized.
 * DO NOT automatically re-initialize here to prevent multiple connections.
 */
export const getSocket = (): Socket | null => {
  // Return socket if it exists (connected or not, but initialized)
  if (socket) {
    return socket;
  }
  // Don't auto-initialize here - let the app explicitly call initSocket
  // This prevents accidental multiple connections
  return null;
};

/**
 * Disconnect and clean up socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    userIdGlobal = null;
    appKeyGlobal = null;
    gameIdGlobal = null;
    nameGlobal = null;
    profilePictureGlobal = null;
    tokenGlobal = null;
    isInitializing = false;
  }
};

export default initSocket;