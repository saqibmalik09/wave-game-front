'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket/socketClient';

/**
 *  Place Greedy Bet
 */
  export function placeGreedyBet({
  userId,
  amount,
  betType,
  appKey,
  token,
  gameId,
  potIndex,
  socketId,
 tenantBaseURL 
}: {
  userId: string;
  amount: number;
  tableId: number;
  betType: number;
  appKey: string;
  token: string;
  gameId: string;
  potIndex:string;
  socketId:string;
  tenantBaseURL:string;
}) {
 const socket = getSocket();

  if (!socket) {
    console.log('Socket not initialized',socket);
  return ;
  }
  const payload = {
    userId,
    amount,
    betType,
    appKey,
    gameId,
    token,
    potIndex,
    socketId,
    tenantBaseURL

  };
  console.log(`Placeing bet gredy:`,payload);
  socket.emit("placeGreedyBet", payload);
}

export function useGreedyBetResponseListener( onResponse: (data: any) => void) {
  const socket = getSocket();
  if (!socket) {
    console.log('Socket not initialized',socket);
  return ;
  }
  useEffect(() => {
    const handleBetResponse = (data: any) => {
      onResponse(data); // send data back to component
    };
    socket.on("greedyBetResponse", handleBetResponse);

    return () => {
      socket.off("greedyBetResponse", handleBetResponse);
    };
  }, [onResponse]);

}


export function gameGreedyResultAnnounce(
  onResponse: (data: any) => void
) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log('Socket not initialized in useGreedyResultAnnounce');
      return;
    }

    const handleWinningResponse = (data: any) => {
      onResponse(data);
    };

    socket.on('greedyAnnounceGameResultResponse', handleWinningResponse);

    return () => {
      socket.off('greedyAnnounceGameResultResponse', handleWinningResponse);
    };
  }, [onResponse]);
}


export function useCurrentRoundID(
  onResponse: (data: any) => void
) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log('Socket not initialized');
      return;
    }

    const handler = (payload: any) => {
      console.log('Received CurrentRoundIDResponse:', payload);
      onResponse(payload);
    };

    socket.on('CurrentRoundIDResponse', handler);

    return () => {
      socket.off('CurrentRoundIDResponse', handler);
    };
  }, [onResponse]);
}



export function greedyGameTableJoin({
  userId,
  name,
  imageProfile,
  appKey,
  token,
}: {
  userId: string;
  name: string;
  imageProfile: string;
  appKey:string;
  token:string
}) {
 const socket = getSocket();
  console.log("greedyGameTableJoin socket:", socket);
  if (!socket) {
    console.log('Socket not initialized',socket);
  return ;
  }
  const payload = {
    userId,
    name,
    imageProfile,
    appKey,
    token
  };
  console.log("greedyGameTableJoin payload:", payload);
  socket.emit("greedyGameTableJoin", payload);
}