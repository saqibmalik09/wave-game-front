'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getSocket } from '@/lib/socket/socketClient';

interface Player {
  id: number;
  userId: string;
  name: string;
  balance: number | null;
  appKey: string;
  token: string;
  connectionUserId: string;
  socketId: string;
  profilePicture: string;
  totalGamePlayed: number;
  gameWon: number;
  gameLost: number;
  createdAt: string;
  updatedAt: string;
}

interface PlayersUpdateResponse {
  users: Player[];
}

export default function PlayersList() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handlePotDataResponse = (response: PlayersUpdateResponse) => {
      console.log("table response:", response)
      if (response?.users) {
        setPlayers(response.users);
      }
    };

    socket.on('teenpattiGameTableUpdate', handlePotDataResponse);

    return () => {
      socket.off('teenpattiGameTableUpdate', handlePotDataResponse);
    };
  }, []);

  const visiblePlayers = players.slice(0, 5);
  const remainingCount = players.length - 4;

 return (
  <div className='w-11 flex flex-col gap-1'>
    {remainingCount > 0 && (
      <div
        className="flex flex-col rounded-r-lg overflow-hidden shadow-lg"
        style={{
          background: 'linear-gradient(180deg, #4F1120 0%, #4F1120 100%)',
        }}
      >
        {/* Rank Header */}
        <div
          className="text-center font-black text-white text-[8px] tracking-widest bg-gradient-to-b from-[#700D2B] to-[#6B0D2A] border-b border-white/10 py-1"
        >
          Rank
        </div>

        {/* Players List */}
        <div className="flex flex-col gap-1 p-1"> 
          {visiblePlayers.map((player, index) => {
            const crownGradient =
              index === 0
                ? 'linear-gradient(135deg, #ffd700, #ffed4e)'
                : index === 1
                  ? 'linear-gradient(135deg, #c0c0c0, #e8e8e8)'
                  : index === 2
                    ? 'linear-gradient(135deg, #cd7f32, #e9a96b)'
                    : 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                    

            return (
              <div
                key={player.userId}
                title={player.name}
                className="relative flex justify-center items-center"
                style={{
                  width: '100%',
                  height: '30px',
                }}
              >
                {/* Player Image with crown-colored rounded border */}
                <div
                  className="rounded-md p-[2px]"
                  style={{ 
                    background: crownGradient,
                    width: '30px',
                    height: '30px',
                  }}
                >
                  <Image
                    src={player.profilePicture??'https://randomuser.me/api/portraits/women/91.jpg'}
                    alt={player.name??"Player"}
                    width={25}
                    height={25}
                    unoptimized
                    className="object-cover rounded-sm w-full h-full"
                  />
                </div>

                {/* Crown Badge - top left corner */}
                <div
                  className="absolute flex items-center justify-center rounded-full z-10 border border-black/30 shadow-md"
                  style={{ 
                    background: crownGradient,
                    width: '12px',
                    height: '12px',
                    top: '-2px',
                    left: '0px',
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="8"
                    height="8"
                    fill={index < 3 ? '#000' : '#fff'}
                  >
                    <path d="M3 6l4 4 5-6 5 6 4-4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
                    <rect x="5" y="18" width="14" height="2" rx="1" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);
}
