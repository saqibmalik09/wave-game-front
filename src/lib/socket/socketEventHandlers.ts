'use client';
import { getSocket, initSocket } from './socketClient';
import { setCache, getCache } from "../cache";
/**
 * Global Socket Event Handlers
 * Handles user data from socket responses across all games.
 */


export function gameConfiguration(
  gameId: number | string | { gameId: number | string },
  callback: (data: any) => void
) {
  const socket = getSocket();

  if (!socket) {
    console.log('Socket not initialized', socket);
    return;
  }
  // Normalize gameId to a number
  const id = typeof gameId === "object" ? Number(gameId.gameId) : Number(gameId);
  const cacheKey = `game_config_${id}`;

  // Check cache first
  const cached = getCache(cacheKey);
  if (cached) {
    callback(cached);
    return;
  }

  //  Fetch from socket if not cached
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

export function tanantDetailsByAppKey(
  appKey: string | undefined,
  callback: (data: any) => void
): void {
  const socket = getSocket();

  if (!socket) {
    console.log('Socket not initialized', socket);
    return;
  }
  socket.emit("tenantDetailsByAppKey", { appKey });

  const handleResponse = (data: any) => {
    socket.off("tenantDetailsResponse", handleResponse);
    callback(data);
  };

  socket.on("tenantDetailsByAppKeyResponse", handleResponse);
}



