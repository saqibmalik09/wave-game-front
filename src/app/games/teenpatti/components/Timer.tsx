'use client';

import React, { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket/socketClient';
import { useTeenpattiTimerListener } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';
import { useDispatch } from 'react-redux';
import { updateTimer } from '@/lib/redux/slices/teenpatti/teenpattiTimerSlice';

export default function Timer() {
      const dispatch = useDispatch();
  const [timerData, setTimerData] = useState<any>(null);
  useTeenpattiTimerListener();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    let lastPhase: string | null = null;

    const handleTimer = (data: any) => {
      setTimerData(data);
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
  }, []);

  if (!timerData) return null;

  const { phase, remaining, phaseDuration } = timerData;

  const safeRemaining = typeof remaining === 'number' ? remaining : 0;
  const totalDuration = typeof phaseDuration === 'number' ? phaseDuration : safeRemaining; // fallback
  const progress = totalDuration > 0 ? (safeRemaining / totalDuration) * 100 : 0;

  const isLowTime = safeRemaining <= 5 && phase === 'bettingTimer';
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = `${circumference - (progress / 100) * circumference}`;
  const strokeColor = isLowTime ? '#ff4646' : phase === 'bettingTimer' ? '#48e5a6' : '#00c2ff';

  const phaseLabels: Record<string, string> = {
    bettingTimer: 'BET',
    winningCalculationTimer: 'CALC',
    resultAnnounceTimer: 'RESULT',
    newGameStartTimer: 'WAIT',
  };

  return (
    <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 40, marginTop: '-100px' }}>
      <div className="position-relative" style={{ width: '100px', height: '100px' }}>
        <svg className="w-100 h-100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="40" stroke="#333" strokeWidth="8" fill="none" />
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={strokeColor}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 1s linear',
              filter: isLowTime ? `drop-shadow(0 0 10px ${strokeColor})` : 'none',
            }}
          />
        </svg>

        <div className="position-absolute top-50 start-50 translate-middle text-center select-none"
             style={{ animation: isLowTime ? 'pulse 1s infinite' : 'none' }}>
          <div className="fw-bold" style={{ fontSize: '32px', color: isLowTime ? '#ff4646' : '#fff', lineHeight: 1 }}>
            {safeRemaining}
          </div>
          <div className="text-secondary" style={{ fontSize: '11px', marginTop: '2px' }}>
            {phaseLabels[phase] || phase.toUpperCase()}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
