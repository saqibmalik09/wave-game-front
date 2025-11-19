'use client';
import { useEffect } from 'react';
import { initSocket } from './socketClient';
import { useAppDispatch } from '../redux/hooks';
import { userDataFailure, userDataRequest, userDataSuccess } from '../redux/slices/userSlice';
import { setCache, getCache } from "../cache";

/**
 * Global Socket Event Handlers
 * Handles user data from socket responses across all games.
 */
export function useGlobalSocketEvents(userId?: number) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = initSocket();

    if (userId) {
      // console.log('[SocketGlobal] 🔄 Requesting user data for userId:', userId);
      dispatch(userDataRequest());
      socket.emit('userIdData', { userId });
    }

    const handleUserDataResponse = (data: any) => {
      // console.log('[SocketGlobal] 💰 User data received:', data);

      if (data.success && data.data) {
        const { userId, name, imageProfile, balance } = data.data;
        dispatch(
          userDataSuccess({
            userId,
            name,
            imageProfile,
            balance,
          })
        );
      } else {
        dispatch(userDataFailure(data.message || 'Failed to fetch user data'));
      }
    };

    socket.on('userIdDataResponse', handleUserDataResponse);
    // console.log('[SocketGlobal] Listening for "userIdDataResponse" events...');

    return () => {
      socket.off('userIdDataResponse', handleUserDataResponse);
      // console.log('[SocketGlobal] ❌ Stopped listening for "userIdDataResponse"');
    };
  }, [userId, dispatch]);
}


export function gameConfiguration(
  gameId: number | string | { gameId: number | string },
  callback: (data: any) => void
) {
  const socket = initSocket();

  // Normalize gameId to a number
  const id = typeof gameId === "object" ? Number(gameId.gameId) : Number(gameId);
  const cacheKey = `game_config_${id}`;

  // 1️⃣ Check cache first
  const cached = getCache(cacheKey);
  if (cached) {
    callback(cached);
    return;
  }

  // 2️⃣ Fetch from socket if not cached
  socket.emit("gameConfiguration", { gameId: id });

  const handleResponse = (data: any) => {
    socket.off("gameConfigurationResponse", handleResponse);

    if (!data?.success) {
      console.error("[Socket] Failed to fetch game config:", data);
      return;
    }

    // 3️⃣ Cache in RAM + localStorage
    setCache(cacheKey, data.data);

    // console.log("[Socket] Game config received & cached:", data.data);
    callback(data.data);
  };

  socket.on("gameConfigurationResponse", handleResponse);
}


