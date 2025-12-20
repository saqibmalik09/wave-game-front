// src/app/games/teenpatti/components/Timer.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket/socketClient';
import { useTeenpattiTimerListener } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';
import { useDispatch } from 'react-redux';
import { updateTimer } from '@/lib/redux/slices/teenpatti/teenpattiTimerSlice';
import { SoundManager } from '../game/SoundManager';
import dynamic from 'next/dynamic';

const Player = dynamic(() =>import('@lottiefiles/react-lottie-player').then((mod) => mod.Player), { ssr: false });
interface TimerData {
  phase: string;
  remaining: number;
  totalTime?: number;
  phaseDuration?: number;
}

export default function Timer() {
  const dispatch = useDispatch();
  const [timerData, setTimerData] = useState<TimerData>();
  useTeenpattiTimerListener();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    let lastPhase: string | null = null;

    const handleTimer = (data: any) => {
      setTimerData(data);
      if (data.remaining === 3 && data.phase === 'bettingTimer') {
        SoundManager.getInstance().play('timerUpSound');
      }
      if (data.phase && data.phase !== lastPhase) {
        dispatch(
          updateTimer({
            phase: data.phase,
            remainingTime: data.remaining,
            totalTime: data.totalTime || undefined,
          })
        );
        lastPhase = data.phase;
      }
    };

    socket.on('teenpattiTimer', handleTimer);

    return () => {
      socket.off('teenpattiTimer', handleTimer);
    };
  }, [dispatch]);

  if (!timerData) return null;

  const { phase, remaining } = timerData;
  const safeRemaining = typeof remaining === 'number' ? remaining : 0;

  const isLowTime = safeRemaining <= 5 && phase === 'bettingTimer';

  return (
    <div 
      className={`position-fixed start-50 translate-middle-x z-40 ${isLowTime ? 'shake' : ''}`}
      style={{ pointerEvents: 'none' }} // Click-safe: doesn't block underlying elements
    >
      <div
        className="clock-wrapper"
        style={{
          width: 'clamp(38px, 5vw, 40px)',
          height: 'clamp(38px, 5vw, 40px)',
          position: 'relative',
        }}
      >
        {/* Lottie Player loads from public file URL */}
        <Player
          src="/lottie/clock.json"  // Path to your JSON file (adjust if folder name changes)
          loop={true}
          autoplay={true}  
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* Time text overlay in center */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none', // Also click-safe
            textAlign: 'center',
          }}
        >
          <span
          className='text-white'
            style={{
              fontSize: 'clamp(12px, 2vw, 12px)', // Responsive, smaller than before for tiny clock
              fontWeight: '700',
            }}
          >
            {safeRemaining}
          </span>
        </div>
      </div>

      <style jsx>{`
        .clock-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shake {
          animation: shake 0.4s infinite;
        }

        @keyframes shake {
          0% { transform: translate(0); }
          25% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
          75% { transform: translate(2px, 2px); }
          100% { transform: translate(0); }
        }
      `}</style>
    </div>
  );
}