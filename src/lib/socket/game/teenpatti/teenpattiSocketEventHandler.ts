'use client';

import { useEffect } from 'react';
import { initSocket } from '@/lib/socket/socketClient';

/**
 * 🎯 Teen Patti Timer Listener
 */


export function useTeenpattiTimerListener() {
  useEffect(() => {
    const socket = initSocket();
    const handleTimer = (data: any) => {
      if (data.phase == 'winningCalculationTimer') {
        teenpattiAnnounceGameResult();
      }
    };
    socket.on('teenpattiTimer', handleTimer);

    return () => {
      socket.off('teenpattiTimer', handleTimer);
    };
  }, []);
}

/**
 *  Place Teen Patti Bet
 */
  export function placeTeenpattiBet({
  userId,
  amount,
  tableId,
  betType,
}: {
  userId: string;
  amount: number;
  tableId: number;
  betType: string;
}) {
  const socket = initSocket();

  const payload = {
    userId,
    amount,
    tableId,
    betType,
  };

  console.log(" Emitting bet:", payload);

  socket.emit("placeTeenpattiBet", payload);
}
export function useTeenpattiBetResponseListener(
  onResponse: (data: any) => void
) {
  useEffect(() => {
    const socket = initSocket();

    const handleBetResponse = (data: any) => {
      console.log("Bet Response:", data);
      onResponse(data); // send data back to component
    };

    socket.on("teenpattiBetResponse", handleBetResponse);

    return () => {
      socket.off("teenpattiBetResponse", handleBetResponse);
    };
  }, [onResponse]);

}
// game users and pots
export function teenpattiPotBetsAndUsers({ gameId }: { gameId: number }): Promise<any> {
  const socket = initSocket();

  return new Promise((resolve, reject) => {
    const payload = { gameId };
    // console.log('[TeenPatti] 🎯 Requesting pot and user data:', payload);

    // Response handler
    const handleResponse = (data: any) => {
      socket.off('teenpattiPotBetsAndUsersResponse', handleResponse); // remove listener after response

      if (!data) return reject(new Error('No data received from server'));

      if (data.success === undefined || data.success === true) {
        resolve(data); // Keep data format exactly as is
      } else {
        reject(new Error(data.message || 'Failed to fetch pot and users'));
      }
    };
    socket.emit('teenpattiPotBetsAndUsers', payload);
    socket.on('teenpattiPotBetsAndUsersResponse', handleResponse);

  });
}



// game users and pots
export function teenpattiAnnounceGameResult() {
  const socket = initSocket();

  socket.emit('teenpattiAnnounceGameResult', {});

  const teenpattiAnnounceGameResultResponse = (data: any) => {
    // console.log('[TeenPatti]  Raw teenpattiAnnounceGameResultResponse received:', data);

    if (!data) {
      console.error('[TeenPatti]  No data received from server');
      return;
    }

    // Some servers don’t send `success` flag — handle both cases
    if (data.success === undefined || data.success === true) {
      // console.log('[TeenPatti]  Game teenpattiAnnounceGameResultResponse Pot Bets And Users received successfully:');
      // console.table(data);
    } else {
      console.error('[TeenPatti] ❌ Game teenpattiAnnounceGameResultResponse failed:', data.message || data);
    }
  };
  socket.on('teenpattiAnnounceGameResultResponse', teenpattiAnnounceGameResultResponse);

}


