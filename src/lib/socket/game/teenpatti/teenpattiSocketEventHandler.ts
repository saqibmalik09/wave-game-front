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
  console.log("teenpattiGameTableJoin socket:", socket);
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



export function gameTeenPattiResultAnnounce(
  onResponse: (data: any) => void
) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log('Socket not initialized in useTeenPattiResultAnnounce');
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


export function useTeenpattiBetSumResponse(
  onResponse: (data: any) => void
) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log('Socket not initialized in teenpattiBetSumResponse');
      return;
    }

    const handlePotBetSumResponse = (data: any) => {
      onResponse(data);
    };

    socket.on('potTotalBets', handlePotBetSumResponse);

    return () => {
      socket.off('potTotalBets', handlePotBetSumResponse);
    };
  }, [onResponse]);
}


export function useTeenpattiPatternResponse(
  onResponse: (data: any) => void
) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.log('Socket not initialized in TeenpattiPatternResponse');
      return;
    }

    const handlePatternResponse = (data: any) => {
      console.log('in socket TeenpattiPatternResponse:', data);
      onResponse(data);
    };

    socket.on('teenpattiWinningCombinationResponse', handlePatternResponse);

    return () => {
      socket.off('teenpattiWinningCombinationResponse', handlePatternResponse);
    };
  }, [onResponse]);
}