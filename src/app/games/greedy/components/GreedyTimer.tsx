// src/app/games/teenpatti/components/Timer.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket/socketClient';
import { useDispatch } from 'react-redux';
import { updateTimer } from '@/lib/redux/slices/teenpatti/teenpattiTimerSlice';

import { SoundManager } from '../../teenpatti/game/SoundManager';
interface TimerData {
  phase: string;
  remaining: number;
  totalTime?: number;
  phaseDuration?: number;
}

export default function GreedyTimer() {
  const dispatch = useDispatch();
  const [timerData, setTimerData] = useState<TimerData>();

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

    socket.on('greedyTimer', handleTimer);

    return () => {
      socket.off('greedyTimer', handleTimer);
    };
  }, [dispatch]);

  if (!timerData) return null;

  const { phase, remaining } = timerData;
  const safeRemaining = typeof remaining === 'number' ? remaining : 0;
  const isCritical = safeRemaining <= 3 && phase === 'bettingTimer';

  return (
    <div
      className={`position-fixed start-50 translate-middle-x z-40`}
      style={{ pointerEvents: 'none' }}
    >
      <span
        className="text-white"
        style={{
          fontSize: 'clamp(17px, 2.5vw, 17px)',
          fontWeight: 700,
        }}
      >
        {safeRemaining}
      </span>

    </div>
  );
}
