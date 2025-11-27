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
    <div 
      className="fixed top-0 left-0 right-0 z-50" 
      style={{ 
        padding: 'clamp(8px, 1.5vw, 16px)'
      }}
    >
      <div className="container mx-auto" style={{ maxWidth: '1600px' }}>
        <div 
          className="d-flex justify-content-between align-items-center rounded-pill"
          style={{
            padding: 'clamp(8px, 1.2vw, 1px) clamp(12px, 2vw, 24px)',
            background: 'linear-gradient(180deg, #4f2b5f 0%, #3e1842 100%)',
            boxShadow: '0 clamp(2px, 0.5vw, 4px) clamp(10px, 2vw, 20px) rgba(0, 0, 0, 0.5)',
            gap: 'clamp(8px, 1.5vw, 16px)',
          }}
        >
          {/* Left: Back & Menu */}
          <div 
            className="d-flex align-items-center"
            style={{ gap: 'clamp(4px, 0.8vw, 8px)' }}
          >
            <button 
              className="btn btn-dark rounded-circle p-0 d-flex align-items-center justify-content-center"
              style={{ 
                width: 'clamp(32px, 5vw, 48px)', 
                height: 'clamp(32px, 5vw, 48px)',
                minWidth: '32px',
              }}
              onClick={() => window.history.back()}
            >
              <svg 
                width="clamp(14px, 2vw, 20px)" 
                height="clamp(14px, 2vw, 20px)" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2"
                style={{
                  width: 'clamp(14px, 2vw, 20px)',
                  height: 'clamp(14px, 2vw, 20px)',
                }}
              >
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>

          {/* Center: Maximum Bet */}
          <div 
            className="text-warning fw-bold text-center d-none d-md-block"
            style={{
              fontSize: 'clamp(10px, 1.4vw, 16px)',
              whiteSpace: 'nowrap',
            }}
          >
            Maximum bet 200k
          </div>

          {/* Right: Balance, Sound, Settings */}
          <div 
            className="d-flex align-items-center"
            style={{ gap: 'clamp(4px, 0.8vw, 8px)' }}
          >
            {/* Balance */}
            <div 
              className="d-flex align-items-center rounded-pill"
              style={{ 
                background: 'rgba(0, 0, 0, 0.4)',
                gap: 'clamp(4px, 0.6vw, 8px)',
                padding: 'clamp(4px, 0.6vw, 8px) clamp(8px, 1.2vw, 12px)',
              }}
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ 
                  width: 'clamp(20px, 3vw, 28px)', 
                  height: 'clamp(20px, 3vw, 28px)', 
                  background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                  color: '#000',
                  fontSize: 'clamp(10px, 1.4vw, 14px)',
                  minWidth: '20px',
                }}
              >
                G
              </div>
              <span 
                className="text-white fw-bold"
                style={{ 
                  fontSize: 'clamp(11px, 1.4vw, 15px)',
                  whiteSpace: 'nowrap',
                }}
              >
                {userPlayerData?.data?.balance?.toLocaleString() || '0'}
              </span>
            </div>

            {/* Sound Toggle */}
            <button 
              className="btn btn-dark rounded-circle p-0 d-flex align-items-center justify-content-center"
              style={{ 
                width: 'clamp(32px, 5vw, 48px)', 
                height: 'clamp(32px, 5vw, 48px)',
                minWidth: '32px',
                transition: 'all 0.2s ease',
                opacity: soundEnabled ? 1 : 0.6,
              }}
              onClick={toggleSound}
            >
              {soundEnabled ? (
                <svg 
                  width="clamp(14px, 2vw, 20px)" 
                  height="clamp(14px, 2vw, 20px)" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2"
                  style={{
                    width: 'clamp(14px, 2vw, 20px)',
                    height: 'clamp(14px, 2vw, 20px)',
                  }}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              ) : (
                <svg 
                  width="clamp(14px, 2vw, 20px)" 
                  height="clamp(14px, 2vw, 20px)" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#ff4444" 
                  strokeWidth="2"
                  style={{
                    width: 'clamp(14px, 2vw, 20px)',
                    height: 'clamp(14px, 2vw, 20px)',
                  }}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}