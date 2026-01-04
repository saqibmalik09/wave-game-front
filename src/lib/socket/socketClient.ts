'use client';

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_SOCKET_URL;

let socket: Socket | null = null;
let userIdGlobal: string | null = null;
let appKeyGlobal: string | null = null;
let nameGlobal: string | null = null;
let profilePictureGlobal: string | null = null;
let tokenGlobal: string | null = null;

interface InitSocketOptions {
  userId: string;
  appKey: string;
  name: string;
  profilePicture: string;
  token: string;
}

/**
 * Initialize the socket.
 * Must provide userId, appKey, token.
 * If already initialized, returns existing socket.
 */
export const initSocket = ({ userId, appKey, name, profilePicture, token }: InitSocketOptions): Socket => {

  if (!userId || !appKey || !name || !profilePicture) {
    throw new Error('[Socket] Cannot initialize: missing userId, appKey, or token');
  }
  userIdGlobal = userId;
  appKeyGlobal = appKey;
  nameGlobal = name;
  profilePictureGlobal = profilePicture;
  tokenGlobal = token
  // If socket already exists and is connected, just return it
  if (socket && socket.connected) {
    console.log("Socket already connected, reusing:", socket.id);
    return socket;
  }

  // Create new socket connection
  socket = io(SOCKET_URL!, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 30,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 5000,  
    randomizationFactor: 0.5,
    timeout: 15000,
    query: { userId, appKey, name, profilePicture, token },
  });
  if(socket.connected==false){
      console.log(' Initializing new socket connection...', socket.id);
      setTimeout(() => {
        if (socket && !socket.connected) {
          console.warn('[Socket] Connection timeout, disconnecting...');
          socket.connect();
        }
      }, 4000);
      }else{
        console.log(' Socket already connected:', socket.id);
      }

  socket.on('connect', () => console.log('🔥 Socket Connected:', socket?.id));
  socket.on('reconnect', () => console.log('♻️ Socket Reconnected:', socket?.id));
  socket.on('connect_error', (err) => console.warn('[Socket] Connection error:', err.message));
  socket.on('disconnect', (reason) => console.warn('[Socket] Disconnected:', reason));

  return socket;
};

/**
 * Returns the socket instance if already initialized and connected.
 * Otherwise returns null.
 *  DO NOT call initSocket here - let the app initialize it first
 */
export const getSocket = () => {
  //return socket if exist else init socket from global and return 
  if (socket && socket.connected) {
    return socket;
  } else if (userIdGlobal && appKeyGlobal && nameGlobal && profilePictureGlobal && tokenGlobal) {
    return initSocket({ userId: userIdGlobal, appKey: appKeyGlobal, name: nameGlobal, profilePicture: profilePictureGlobal, token: tokenGlobal });
  }
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
    nameGlobal = null;
    profilePictureGlobal = null
  }
};

export default initSocket;