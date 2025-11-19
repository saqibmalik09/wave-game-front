// src/app/teenpatti/components/PlayersList.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket/socketClient';

interface Player {
  userId: string;
  name: string;
  imageProfile: string;
}

export default function PlayersList() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handlePotDataResponse = (response: any) => {
      if (response?.success && response?.data?.users) {
        setPlayers(response.data.users);
      }
    };

    socket.on('teenpattiPotBetsAndUsersResponse', handlePotDataResponse);

    return () => {
      socket.off('teenpattiPotBetsAndUsersResponse', handlePotDataResponse);
    };
  }, []);

  const visiblePlayers = players.slice(0, 4);
  const remainingCount = players.length - 4;

  return (
    <div 
      className="position-fixed start-0 top-0 mt-5 ms-3 p-3 rounded-4"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        zIndex: 40,
        marginTop: '120px',
      }}
    >
      <div className="d-flex flex-column gap-3">
        {visiblePlayers.map((player) => (
          <div key={player.userId} className="position-relative" title={player.name}>
            <img
              src={player.imageProfile}
              alt={player.name}
              className="rounded-circle"
              style={{
                width: '56px',
                height: '56px',
                border: '3px solid rgba(255, 255, 255, 0.3)',
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
                width: '14px',
                height: '14px',
                background: '#22c55e',
                border: '2px solid #000',
              }}
            />
          </div>
        ))}

        {/* Remaining players badge */}
        {remainingCount > 0 && (
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
            }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    </div>
  );
}