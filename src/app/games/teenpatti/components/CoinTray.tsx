//CoinTray.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setCoin } from '@/lib/redux/slices/teenpatti/selectedCoinSlice';
import { SoundManager } from '../game/SoundManager';
import { useGlobalSocketEvents } from '@/lib/socket/socketEventHandlers';

interface CoinButtonProps {
  amount: number;
  color: string;
  isSelected: boolean;
  onClick: () => void;
}

function CoinButton({ amount, color, isSelected, onClick }: CoinButtonProps) {
  const displayAmount = amount >= 1000 ? `${amount / 1000}k` : amount;

  return (
    <button
      onClick={onClick}
      className="btn p-0 position-relative"
      style={{
        transition: 'all 0.2s ease',
        transform: isSelected ? 'translateY(-12px) scale(1.1)' : 'none',
      }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
        style={{
          width: '72px',
          height: '72px',
          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd)`,
          border: `4px solid rgba(255, 255, 255, 0.3)`,
          boxShadow: isSelected
            ? `0 10px 30px ${color}88, 0 0 20px ${color}66`
            : `0 4px 12px rgba(0, 0, 0, 0.4)`,
        }}
      >
        {displayAmount}
      </div>

      {isSelected && (
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x rounded-circle"
          style={{
            width: '8px',
            height: '8px',
            background: '#ffd700',
            animation: 'pulse 1.5s infinite',
          }}
        />
      )}
    </button>
  );
}

export default function CoinTray() {
  useGlobalSocketEvents(101);

  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.user.user);
  const gameConfig = useSelector((state) => state.gameConfiguration.data);

  const bettingCoins = gameConfig?.bettingCoins || [];
  const colors = gameConfig?.colors || [];

  const [selectedCoin, setSelectedCoinLocal] = useState<number | null>(null);

  // Auto select only once
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && bettingCoins.length > 0) {
      initialized.current = true;

      const amount = bettingCoins[0];
      const color = colors[0];

      setSelectedCoinLocal(amount);
      dispatch(setCoin({ amount, color }));
    }
  }, [bettingCoins, colors, dispatch]);

  const onClickCoin = (amount: number, color: string) => {
    SoundManager.getInstance().play('betButtonAndCardClickSound');

    setSelectedCoinLocal(amount);
    dispatch(setCoin({ amount, color }));
  };

  return (
    <div className="position-fixed bottom-0 start-50 translate-middle-x mb-4" style={{ zIndex: 50 }}>
      <div
        className="px-4 py-3 rounded-pill d-flex align-items-center gap-3"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Balance */}
        <div
          className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill me-2"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
            }}
          >
            <span className="fw-bold" style={{ color: '#000' }}>₹</span>
          </div>

          <div className="d-flex flex-column">
            <small className="text-secondary" style={{ fontSize: '10px' }}>Balance</small>
            <span className="text-white fw-bold" style={{ fontSize: '14px' }}>
              {user?.balance?.toLocaleString() || '0'}
            </span>
          </div>
        </div>

        {/* Dynamic Coins */}
        {bettingCoins.map((amount:any, index:any) => (
          <CoinButton
            key={amount}
            amount={amount}
            color={colors[index % colors.length]}
            isSelected={selectedCoin === amount}
            onClick={() => onClickCoin(amount, colors[index % colors.length])}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
