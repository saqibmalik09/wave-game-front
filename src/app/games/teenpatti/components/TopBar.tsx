// src/app/teenpatti/components/TopBar.tsx
'use client';

import { RootState } from '@/lib/redux/store';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SoundManager } from '../game/SoundManager';

export default function TopBar() {
  const userPlayerData = useSelector((state: RootState) => state.userPlayerData);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize sound state from SoundManager
  useEffect(() => {
    const soundManager = SoundManager.getInstance();
    setSoundEnabled(soundManager.isEnabled());
  }, []);

  const toggleSound = () => {
    const soundManager = SoundManager.getInstance();
    const newState = soundManager.toggle();
    setSoundEnabled(newState);

    // Optional: Play a test sound when enabling
    if (newState) {
      soundManager.play('betButtonAndCardClickSound', 0.3);
    }
  };

  return (
    <div className="sticky w-full" >
      <div className="container mx-auto" >
        <div
          className="d-flex justify-content-between align-items-center rounded-pill"
          style={{
            // background: 'linear-gradient(180deg, #4f2b5f 0%, #3e1842 100%)',
            // boxShadow: '0 clamp(2px, 0.5vw, 4px) clamp(10px, 2vw, 20px) rgba(0, 0, 0, 0.5)',
            // gap: 'clamp(6px, 1.0vw, 12px)',
          }}
        >
          {/* Left: Back & Menu */}
          <div className="d-flex align-items-center" style={{ gap: 'clamp(4px, 0.8vw, 8px)' }}>
            <button
              className="rounded-circle p-0 d-flex align-items-center justify-content-center border-0 "
              style={{
                minWidth: '20px',
              }}
              onClick={() => window.history.back()}
            >
              <svg className='rounded-xl' xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 12 12" width="26" height="26" fill="#ffc109ff" style={{ opacity: 1, transform: 'rotate(90deg)' }}><rect x="-2" y="-2" width="12" height="12" fill="#853426" /><path d="M4.5 1C2.57 1 1 2.57 1 4.5V5H0l2 2l2-2H3v-.5a2.5 2.5 0 0 1 5 0C8 2.57 6.43 1 4.5 1" /></svg>
            </button>
          </div>


          {/* Center: Maximum Bet */}
          <div className="d-md-block p-0" style={{ maxWidth: '100%', marginTop:"-3px" }}>
            <svg
              viewBox="0 0 260 70"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                display: 'block',
                width: 'clamp(110px, 14vw, 160px)',
                height: 'auto',
                maxWidth: '100%',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D4941E" />
                  <stop offset="50%" stopColor="#F4C245" />
                  <stop offset="100%" stopColor="#D4941E" />
                </linearGradient>
              </defs>

              {/* OUTER BORDER */}
              <path
                d="
        M 10 4
        L 250 4
        L 220 58
        Q 210 66 200 66
        L 60 66
        Q 50 66 40 58
        Z
      "
                fill="url(#goldBorder)"
              />

              {/* INNER BG */}
              <path
                d=" M 16 9
        L 244 9
        L 214 55
        Q 206 62 196 62
        L 64 62
        Q 54 62 46 55
        Z
      "
                fill="#4C141B"
              />

              {/* TOP SHADOW */}
              <rect x="16" y="9" width="228" height="12" fill="#000" opacity="0.25" />

              {/* TEXT - TWO ROWS */}
              <text
                x="130"
                y="30"
                textAnchor="middle"
                fontSize="16"
                fontWeight="600"
                fill="#FFC17B"
                style={{ letterSpacing: '0.5px' }}
              >
                Maximum bet
              </text>

              <text
                x="130"
                y="48"
                textAnchor="middle"
                fontSize="14"
                fontWeight="700"
                fill="#FFC17B"
                style={{ letterSpacing: '0.5px' }}
              >
                100000k
              </text>
            </svg>
          </div>

          {/* Right: Balance, Sound, Settings */}
          <div className="d-flex align-items-center"
            style={{ gap: 'clamp(4px, 0.5vw, 5px)' }}
          >
            {/* Balance */}
            <div
              className="d-flex align-items-center rounded-pill"
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                gap: 'clamp(4px, 0.6vw, 8px)',
                padding: 'clamp(4px, 0.4vw, 3px) clamp(4px, 0.4vw, 3px)',
              }}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{
                  width: 'clamp(10px, 1vw, 10px)',
                  height: 'clamp(10px, 1vw, 10px)',
                  background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                  color: '#000',
                  fontSize: 'clamp(8px, 1vw, 8px)',
                  minWidth: '8px',
                }}
              >
                G
              </div>
              <span
                className="text-white fw-bold"
                style={{
                  fontSize: 'clamp(5px, 0.8vw, 10px)',
                  whiteSpace: 'nowrap',
                }}
              >
                {userPlayerData?.data?.balance?.toLocaleString() || '0'}
              </span>
            </div>

            {/* Sound Toggle */}
            <button
              className="btn rounded-circle p-0 d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: '#853426',
                width: 'clamp(18px, 5vw, 25px)',
                height: 'clamp(18px, 5vw, 25px)',
                minWidth: '20px',
                transition: 'all 0.2s ease',
              }}
              onClick={toggleSound}
            >
              {soundEnabled ? (
                <svg
                  width="clamp(10px, 2vw, 16px)"
                  height="clamp(10px, 2vw, 16px)"
                  viewBox="0 0 24 24"
                  fill="#ffde22ff"
                  stroke="#ffd700"
                  strokeWidth="2"
                  style={{
                    width: 'clamp(10px, 2vw, 16px)',
                    height: 'clamp(10px, 2vw, 16px)',
                  }}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg
                  width="clamp(10px, 2vw, 16px)"
                  height="clamp(10px, 2vw, 16px)"
                  viewBox="0 0 24 24"
                  fill="#ffd700"
                  stroke="#ffd700"
                  strokeWidth="2"
                  style={{
                    width: 'clamp(10px, 2vw, 16px)',
                    height: 'clamp(10px, 2vw, 16px)',
                  }}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}