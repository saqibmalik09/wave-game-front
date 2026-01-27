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
  socket.emit("placeTeenpattiBet", payload);
}


   


export function useGreedyBetResponseListener( onResponse: (data: any) => void) {
  const socket = getSocket();
  console.log("useGreedyBetResponseListener socket:", socket);
  if (!socket) {
    console.log('Socket not initialized',socket);
  return ;
  }
  useEffect(() => {
    const handleBetResponse = (data: any) => {
      console.log('Received greedyBetResponse data:', data);
      onResponse(data); // send data back to component
    };
    socket.on("teenpattiBetResponse", handleBetResponse);

    return () => {
      socket.off("teenpattiBetResponse", handleBetResponse);
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

    socket.on('teenpattiAnnounceGameResultResponse', handleWinningResponse);

    return () => {
      socket.off('teenpattiAnnounceGameResultResponse', handleWinningResponse);
    };
  }, [onResponse]);
}
