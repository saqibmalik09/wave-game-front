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

// Configuration constants
const MIN_VISIBLE_PLAYERS = 3;
const MAX_VISIBLE_PLAYERS = 4;

// 10 beautiful gradient colors for crown borders (cycles through)
const CROWN_GRADIENTS = [
  'linear-gradient(135deg, #ffd700, #ffed4e)',     // 1. Gold
  'linear-gradient(135deg, #c0c0c0, #e8e8e8)',     // 2. Silver
  'linear-gradient(135deg, #cd7f32, #e9a96b)',     // 3. Bronze
  'linear-gradient(135deg, #8b5cf6, #a78bfa)',     // 4. Purple
  'linear-gradient(135deg, #ec4899, #f472b6)',     // 5. Pink
  'linear-gradient(135deg, #10b981, #34d399)',     // 6. Green
  'linear-gradient(135deg, #f59e0b, #fbbf24)',     // 7. Amber
  'linear-gradient(135deg, #3b82f6, #60a5fa)',     // 8. Blue
  'linear-gradient(135deg, #ef4444, #f87171)',     // 9. Red
  'linear-gradient(135deg, #06b6d4, #22d3ee)',     // 10. Cyan
];

export default function PlayersList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

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

  // Calculate visible count based on expanded state
  const maxVisibleCount = isExpanded ? players.length : MIN_VISIBLE_PLAYERS;
  const visiblePlayers = players.slice(0, maxVisibleCount);
  
  // Calculate remaining count
  const totalPlayers = players.length;
  const remainingCount = isExpanded ? 0 : (totalPlayers - MIN_VISIBLE_PLAYERS);
  
  // Show component only if there are more than MIN_VISIBLE_PLAYERS
  const shouldShowComponent = totalPlayers > MIN_VISIBLE_PLAYERS;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (!shouldShowComponent) return null;

  return (
    <div className="w-11 flex flex-col gap-1">
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
        <div 
          className="flex flex-col gap-1 p-1"
          style={{
            maxHeight: isExpanded ? `${MAX_VISIBLE_PLAYERS * 31}px` : 'auto',
            overflowY: isExpanded ? 'auto' : 'visible',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {visiblePlayers.map((player, index) => {
            // Cycle through 10 colors
            const crownGradient = CROWN_GRADIENTS[index % CROWN_GRADIENTS.length];

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
                {/* Player Image */}
                <div
                  className="rounded-md p-[2px]"
                  style={{
                    background: crownGradient,
                    width: '30px',
                    height: '30px',
                  }}
                >
                  <Image
                    src={
                      player.profilePicture ??
                      'https://randomuser.me/api/portraits/women/91.jpg'
                    }
                    alt={player.name ?? 'Player'}
                    width={25}
                    height={25}
                    unoptimized
                    className="object-cover rounded-sm w-full h-full"
                  />
                </div>

                {/* Crown Badge */}
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

        {/* TOGGLE BUTTON - Inside, at the bottom */}
        <div
          className="flex justify-center items-center p-1 cursor-pointer hover:opacity-90 transition-opacity border-t border-white/10"
          style={{
            background: 'linear-gradient(180deg, #3a0e1a 0%, #4F1120 100%)',
          }}
          onClick={handleToggle}
          title={
            isExpanded
              ? 'Click to collapse'
              : `${remainingCount > 0 ? remainingCount : 'No'} more players - Click to expand`
          }
        >
          <div
            className="rounded-md flex items-center justify-center font-extrabold text-white shadow-lg"
            style={{
              width: '34px',
              height: '34px',
              background: isExpanded
                ? 'linear-gradient(135deg, #b62525, #c92121)'
                : 'linear-gradient(135deg, #255db6, #2156c9)',
              border: '2px solid rgba(255,255,255,0.25)',
              fontSize: '11px',
            }}
          >
            {isExpanded ? (
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="white"
              >
                <path d="M7 14l5-5 5 5H7z" />
              </svg>
            ) : (
              <>+{remainingCount >= 100 ? '99+' : Math.max(0, remainingCount)}</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}