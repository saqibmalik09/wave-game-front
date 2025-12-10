
// timer.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket/socketClient';
import { useTeenpattiTimerListener } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';
import { useDispatch } from 'react-redux';
import { updateTimer } from '@/lib/redux/slices/teenpatti/teenpattiTimerSlice';
import { SoundManager } from '../game/SoundManager';
interface TimerData {
  phase: string;
  remaining: number;
  totalTime?: number; // optional
  phaseDuration?: number; // optional
}
export default function Timer() {
  const dispatch = useDispatch();
  const [timerData, setTimerData] = useState<TimerData>();
  useTeenpattiTimerListener();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return; // 

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

    // ✅ Always return a cleanup function
    return () => {
      socket.off('teenpattiTimer', handleTimer);
    };
  }, [dispatch]); // include dispatch in dependencies


  if (!timerData) return null;

  const { phase, remaining, phaseDuration } = timerData;
  const safeRemaining = typeof remaining === 'number' ? remaining : 0;
  const totalDuration =
    typeof phaseDuration === 'number' ? phaseDuration : safeRemaining;

  const progress =
    totalDuration > 0 ? (safeRemaining / totalDuration) * 100 : 0;

  const isLowTime = safeRemaining <= 5 && phase === 'bettingTimer';

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = `${circumference - (progress / 100) * circumference
    }`;

  const strokeColor = isLowTime ? '#ff4646'
    : phase === 'bettingTimer'
      ? '#48e5a6'
      : '#00c2ff';

  const phaseLabels: Record<string, string> = {
    bettingTimer: 'Start Betting',
    winningCalculationTimer: 'Calculating..',
    resultAnnounceTimer: 'Result',
    newGameStartTimer: 'Wait',
  };

  return (
    <div
      className="position-fixed start-50 translate-middle-x"
      // style={{
      //   top: '95px', // adjust based on TopBar height
      //   zIndex: 40,
      //   maxWidth: 'calc(100% - 20px)', // stays within parent
      // }}
    >
      <div
        className="position-relative"
        style={{
             width: 'clamp(40px, 5vw, 50px)', // smaller min and max
             height: 'clamp(40px, 5vw, 50px)',
        }}
      >
        {/* Use viewBox to make SVG scale */}
        <svg
          viewBox="0 0 100 100"
          className="w-100 h-100"
          style={{ transform: 'rotate(-90deg)' }}
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#333"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
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

        {/* Text inside circle */}
        <div
          className="position-absolute top-50 start-50 translate-middle text-center select-none"
          style={{ animation: isLowTime ? 'pulse 1s infinite' : 'none' }}
        >
          <div
            className="fw-bold"
            style={{
              fontSize: 'clamp(10px, 2.5vw, 12px)',
              color: isLowTime ? '#ff4656' : '#fff',
              lineHeight: 1,
            }}
          >
            {safeRemaining}
          </div>

          {/* <div
            className="text-secondary"
            style={{
              fontSize: 'clamp(7px, 2vw, 12px)',
              marginTop: '2px',
            }}
          >
            {phaseLabels[phase] || phase.toUpperCase()}
          </div> */}
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
