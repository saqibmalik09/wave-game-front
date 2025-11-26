'use client';
import { initSocket } from './socketClient';
import { setCache, getCache } from "../cache";
const socket = initSocket();
/**
 * Global Socket Event Handlers
 * Handles user data from socket responses across all games.
 */


export function gameConfiguration(
  gameId: number | string | { gameId: number | string },
  callback: (data: any) => void
) {

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

export function tanantDetailsByAppKey(
  appKey: string | undefined,
  callback: (data: any) => void
): void {

  socket.emit("tenantDetailsByAppKey", { appKey });

  const handleResponse = (data: any) => {
    console.log("tenantDetailsResponse data:", data);
    socket.off("tenantDetailsResponse", handleResponse);
    callback(data);
  };

  socket.on("tenantDetailsByAppKeyResponse", handleResponse);
}



