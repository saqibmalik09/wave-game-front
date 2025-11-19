// src/app/teenpatti/components/TopBar.tsx
'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';

export default function TopBar() {
  const user = useAppSelector((state) => state.user.user);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="container mx-auto">
        <div 
          className="d-flex justify-content-between align-items-center px-4 py-3 rounded-pill"
          style={{
            background: 'linear-gradient(180deg, #4f2b5f 0%, #3e1842 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Left: Back & Menu */}
          <div className="d-flex gap-2">
            <button 
              className="btn btn-dark rounded-circle p-2"
              style={{ width: '48px', height: '48px' }}
              onClick={() => window.history.back()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button 
              className="btn btn-dark rounded-circle p-2"
              style={{ width: '48px', height: '48px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
          </div>

          {/* Center: Maximum Bet */}
          <div className="text-warning fw-bold">
            Maximum bet 2000k
          </div>

          {/* Right: Balance, Sound, Settings */}
          <div className="d-flex gap-2 align-items-center">
            {/* Balance */}
            <div 
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill"
              style={{ background: 'rgba(0, 0, 0, 0.4)' }}
            >
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ 
                  width: '28px', 
                  height: '28px', 
                  background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                  color: '#000',
                  fontSize: '14px'
                }}
              >
                ₹
              </div>
              <span className="text-white fw-bold">
                {user?.balance?.toLocaleString() || '0'}
              </span>
            </div>

            {/* Sound Toggle */}
            <button 
              className="btn btn-dark rounded-circle p-2"
              style={{ width: '48px', height: '48px' }}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              )}
            </button>

            {/* Settings */}
            <button 
              className="btn btn-dark rounded-circle p-2"
              style={{ width: '48px', height: '48px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m8.66-15.66l-4.24 4.24m-4.24 4.24l-4.24 4.24M23 12h-6m-6 0H1m20.66 8.66l-4.24-4.24m-4.24-4.24l-4.24-4.24"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}