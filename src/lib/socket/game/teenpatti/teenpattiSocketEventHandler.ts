'use client';

import { useEffect } from 'react';
import { getSocket } from '@/lib/socket/socketClient';


/**
 *  Teen Patti Timer Listener
 */
export function useTeenpattiTimerListener() {
  let socket = getSocket();
  if(!socket) {
   socket=getSocket()
   return ;
  }  
  useEffect(() => {
    const handleTimer = (data: any) => {
      if (data.phase == 'winningCalculationTimer') {
        // teenpattiAnnounceGameResult();
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
 console.log("teenpattiGameTableJoin payload:", payload);
  socket.emit("placeTeenpattiBet", payload);
}

 export function teenpattiGameTableJoin({
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
  console.log("teenpattiGameTableJoin payload:", payload);
  socket.emit("teenpattiGameTableJoin", payload);
}
//  export function mySocketIdEvent({
//   userId,
//   socketId,
// }: {
//   userId: string;
//   socketId: string;
// }) {

//   const payload = {
//     userId,
//     socketId
//   };
//   socket.emit("mySocketId", payload)
// }


      
export function teenpattiGameTableJoinListener(
  onResponse: (data: any) => void
) {
  const socket = getSocket();

  if (!socket) {
    console.log('Socket not initialized',socket);
  return ;
  }
  useEffect(() => {

    const handleBetResponse = (data: any) => {
      console.log("bet response:",data)
      onResponse(data); 
    };

    socket.on("teenpattiGameTableUpdate", handleBetResponse);

    return () => {
      socket.off("teenpattiGameTableUpdate", handleBetResponse);
    };
  }, [onResponse]);

}

export function useTeenpattiBetResponseListener( onResponse: (data: any) => void) {
  const socket = getSocket();
  if (!socket) {
    console.log('Socket not initialized',socket);
  return ;
  }
  useEffect(() => {
    const handleBetResponse = (data: any) => {
      console.log("Received teenpattiBetResponse:", data);
      onResponse(data); // send data back to component
    };
    socket.on("teenpattiBetResponse", handleBetResponse);

    return () => {
      socket.off("teenpattiBetResponse", handleBetResponse);
    };
  }, [onResponse]);

}

// // game users and pots
// export function teenpattiPotBetsAndUsers({ gameId }: { gameId: number }): Promise<any> {
//   const socket = initSocket();

//   return new Promise((resolve, reject) => {
//     const payload = { gameId };

//     // Response handler
//     const handleResponse = (data: any) => {
//       socket.off('teenpattiPotBetsAndUsersResponse', handleResponse); // remove listener after response

//       if (!data) return reject(new Error('No data received from server'));

//       if (data.success === undefined || data.success === true) {
//         resolve(data); // Keep data format exactly as is
//       } else {
//         reject(new Error(data.message || 'Failed to fetch pot and users'));
//       }
//     };
//     socket.emit('teenpattiPotBetsAndUsers', payload);
//     socket.on('teenpattiPotBetsAndUsersResponse', handleResponse);

//   });
// }



// game users and pots
export function teenpattiAnnounceGameResult() {
 const socket = getSocket();

  if (!socket) {
    console.log('Socket not initialized',socket);
  return ;
  }
  socket.emit('teenpattiAnnounceGameResult', {});

  const teenpattiAnnounceGameResultResponse = (data: any) => {
    if (!data) {
      console.error('[TeenPatti]  No data received from server');
      return;
    }  
      // Some servers don’t send `success` flag — handle both cases
    if (data.success === undefined || data.success === true) {
      // console.log('[TeenPatti]  Game teenpattiAnnounceGameResultResponse Pot Bets And Users received successfully:');
      // console.table(data);
    } else {
      // console.error('[TeenPatti]  Game teenpattiAnnounceGameResultResponse failed:', data.message || data);
    }
  };
  socket.on('teenpattiAnnounceGameResultResponse', teenpattiAnnounceGameResultResponse);

}

export function myMessagesFromServer(
  onResponse: (data: any) => void
) {
   const socket = getSocket();

  if (!socket) {
    console.log('Socket not initialized',socket);
  return ;
  }
  useEffect(() => {
    
    const handleBetResponse = (data: any) => {
      onResponse(data); 
    };
    socket.on("toWinnerMessage", handleBetResponse);

    return () => {
      socket.off("toWinnerMessage", handleBetResponse);
    };
  }, [onResponse]);

}

