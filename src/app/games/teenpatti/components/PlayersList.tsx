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
      if (response?.users) {
        setPlayers(response.users);
      }
    };

    socket.on('teenpattiGameTableUpdate', handlePotDataResponse);

    return () => {
      socket.off('teenpattiGameTableUpdate', handlePotDataResponse);
    };
  }, []);

  const visiblePlayers = players.slice(0, 4);
  const remainingCount = players.length - 4;

  return (
    <div
      className="position-fixed start-0 top-0 d-flex flex-column align-items-center gap-2 p-2 rounded-3"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)',
        zIndex: 40,
        marginTop: 'clamp(40px, 6vw, 80px)',
        left: 'clamp(6px, 2vw, 12px)',
        padding: 'clamp(4px, 1vw, 8px)',
      }}
    >
      {visiblePlayers.map((player) => (
        <div key={player.userId} className="position-relative" title={player.name}>
          <Image
            src={player.profilePicture}
            alt={player.name}
            width={48}     // required by next/image
            height={48}    // required by next/image
             unoptimized
            className="rounded-circle"
            style={{
              width: 'clamp(28px, 5vw, 48px)',
              height: 'clamp(28px, 5vw, 48px)',
              border: 'clamp(1px, 0.2vw, 2px) solid rgba(255, 255, 255, 0.3)',
              objectFit: 'cover',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ffd700';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />

          {/* Online indicator */}
          <div
            className="position-absolute bottom-0 end-0 rounded-circle"
            style={{
              width: 'clamp(8px, 2vw, 12px)',
              height: 'clamp(8px, 2vw, 12px)',
              background: '#22c55e',
              border: 'clamp(1px, 0.1vw, 1px) solid #000',
            }}
          />
        </div>
      ))}

      {/* Remaining players badge */}
      {remainingCount > 0 && (
        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
          style={{
            width: 'clamp(28px, 5vw, 48px)',
            height: 'clamp(28px, 5vw, 48px)',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            border: 'clamp(1px, 0.2vw, 2px) solid rgba(255, 255, 255, 0.3)',
            cursor: 'pointer',
            fontSize: 'clamp(10px, 2.5vw, 14px)',
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
