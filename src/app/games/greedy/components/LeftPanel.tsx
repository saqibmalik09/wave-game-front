'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getSocket } from '@/lib/socket/socketClient';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
const MIN_VISIBLE_PLAYERS = 5;
const MAX_VISIBLE_PLAYERS = 6;

// 10 beautiful gradient colors for crown borders
const CROWN_GRADIENTS = [
  'linear-gradient(135deg, #ffd700, #ffed4e)',     // Gold
  'linear-gradient(135deg, #c0c0c0, #e8e8e8)',     // Silver
  'linear-gradient(135deg, #cd7f32, #e9a96b)',     // Bronze
  'linear-gradient(135deg, #8b5cf6, #a78bfa)',     // Purple
  'linear-gradient(135deg, #ec4899, #f472b6)',     // Pink
  'linear-gradient(135deg, #10b981, #34d399)',     // Green
  'linear-gradient(135deg, #f59e0b, #fbbf24)',     // Amber
  'linear-gradient(135deg, #3b82f6, #60a5fa)',     // Blue
  'linear-gradient(135deg, #ef4444, #f87171)',     // Red
  'linear-gradient(135deg, #06b6d4, #22d3ee)',     // Cyan
];

export default function LeftPanel() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handlePotDataResponse = (response: PlayersUpdateResponse) => {
      console.log("table response:", response);
      if (response?.users) {
        console.log("players:", response.users);
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

  // Show players only if there are any
  const hasPlayers = totalPlayers > 0;
  const showExpandButton = totalPlayers > MIN_VISIBLE_PLAYERS;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside
      className="absolute left-1 top-1/2 -translate-y-1/2
        w-12 rounded-xl
        flex flex-col items-center
        shadow-lg z-20"
      style={{
        background: 'linear-gradient(180deg, #fb923c 0%, #f97316 100%)',
        height: isExpanded ? 'auto' : '40%',
        maxHeight: '80%',
      }}
    >
      {/* Header */}
      <div className="w-full text-center font-black text-white text-[10px] tracking-wider py-1 border-b border-white/20">
        Players
      </div>

      {/* Players List */}
      {hasPlayers ? (
        <div
          className="flex flex-col gap-1 p-1 w-full flex-1 overflow-hidden"
          style={{
            maxHeight: isExpanded ? `${MAX_VISIBLE_PLAYERS * 44}px` : 'auto',
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
            const crownGradient = CROWN_GRADIENTS[index % CROWN_GRADIENTS.length];

            return (
              <div
                key={player.userId}
                className="relative flex justify-center items-center"
                style={{
                  width: '100%',
                  height: '40px',
                }}
              >
                {/* Player Image */}
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        tabIndex={0}
                        role="button"
                        aria-label={player.name}
                        className="rounded-lg p-[1px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 transition-all hover:scale-105"
                        style={{
                          background: crownGradient,
                          width: '40px',
                          height: '40px',
                        }}
                      >
                        <Image
                          src={
                            player.profilePicture ||
                            'https://randomuser.me/api/portraits/women/91.jpg'
                          }
                          alt={player.name || 'Player'}
                          width={36}
                          height={36}
                          unoptimized
                          className="object-cover rounded-md w-full h-full"
                        />
                      </div>
                    </TooltipTrigger>

                    <TooltipContent
                      side="right"
                      align="center"
                      className="px-3 py-1.5 text-xs font-semibold z-[9999] bg-gray-900 text-white border-none"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span>{player.name}</span>
                        <span className="text-[10px] text-gray-400">
                          Rank #{index + 1}
                        </span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Crown Badge */}
                <div
                  className="absolute flex items-center justify-center rounded-full z-10 border-2 border-white/30 shadow-lg"
                  style={{
                    background: crownGradient,
                    width: '16px',
                    height: '16px',
                    top: '-3px',
                    left: '-2px',
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="10"
                    height="10"
                    fill={index < 3 ? '#000' : '#fff'}
                  >
                    <path d="M3 6l4 4 5-6 5 6 4-4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
                    <rect x="5" y="18" width="14" height="2" rx="1" />
                  </svg>
                </div>

                {/* Rank Number Badge */}
                <div
                  className="absolute flex items-center justify-center rounded-full z-10 border border-white/50 shadow-md font-bold"
                  style={{
                    background: 'rgba(0, 0, 0, 0.7)',
                    width: '14px',
                    height: '14px',
                    bottom: '-2px',
                    right: '-2px',
                    fontSize: '8px',
                    color: '#fff',
                  }}
                >
                  {index + 1}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center px-2">
          <p className="text-white/60 text-[9px] text-center font-medium">
            No players yet
          </p>
        </div>
      )}

      {/* Toggle Button */}
      {showExpandButton && (
        <div
          className="w-full flex justify-center items-center p-2 cursor-pointer hover:bg-white/10 transition-all border-t border-white/20"
          onClick={handleToggle}
          title={
            isExpanded
              ? 'Click to collapse'
              : `${remainingCount} more players - Click to expand`
          }
        >
          <div
            className="rounded-lg flex items-center justify-center font-extrabold text-white shadow-lg transition-all hover:scale-105"
            style={{
              width: '40px',
              height: '40px',
              background: isExpanded
                ? 'linear-gradient(135deg, #dc2626, #ef4444)'
                : 'linear-gradient(135deg, #2563eb, #3b82f6)',
              border: '2px solid rgba(255,255,255,0.3)',
              fontSize: '11px',
            }}
          >
            {isExpanded ? (
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="white"
              >
                <path d="M7 14l5-5 5 5H7z" />
              </svg>
            ) : (
              <>+{remainingCount >= 100 ? '99+' : Math.max(0, remainingCount)}</>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}