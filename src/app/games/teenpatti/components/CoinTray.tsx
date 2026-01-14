'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCoin } from '@/lib/redux/slices/teenpatti/selectedCoinSlice';
import { SoundManager } from '../game/SoundManager';
import { RootState } from '@/lib/redux/store';
import { useToast } from './Toast';

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
        transition: 'all 0.3s ease',
        transform: isSelected ? 'translateY(-8px) scale(1.1)' : 'translateY(0)',
        filter: isSelected ? 'brightness(1.2)' : 'brightness(1)',
      }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
        style={{
          width: 'clamp(31px, 6vw, 40px)',
          height: 'clamp(31px, 6vw, 40px)',
          fontSize: 'clamp(10px, 2.1vw, 16px)',
          background: `linear-gradient(135deg, ${color}ee 0%, ${color} 50%, ${color}99 100%)`,
          border: `clamp(2px, 0.4vw, 3px) solid ${color}`,
          boxShadow: isSelected
            ? `0 8px 20px ${color}77, inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5)`
            : `0 4px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.5)`,
          color: '#fff',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {displayAmount}
      </div>
    </button>
  );
}

export default function CoinTray() {

  const dispatch = useDispatch();
  const userPlayerData = useSelector((state: RootState) => state.userPlayerData);
  const gameConfig = useSelector((state: RootState) => state.gameConfiguration.data);
  const { ToastContainer, showToast } = useToast();

  const bettingCoins = React.useMemo(() => gameConfig?.bettingCoins || [], [gameConfig]);
  const colors = React.useMemo(() => gameConfig?.colors || [], [gameConfig]);


  const [selectedCoin, setSelectedCoinLocal] = useState<number | null>(null);

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
    <div
      className="position-fixed bottom-0 start-50 translate-middle-x mb-0.8"
      style={{ zIndex: 50, width: '100%', maxWidth: '100%' }}
    >
      <div
        className="rounded-pill d-flex align-items-center gap-1 justify-content-center flex-nowrap"
        style={{
          // background: 'rgba(0, 0, 0, 0.7)',
          // backdropFilter: 'blur(10px)',
          // boxShadow: '0 0.5rem 2rem rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          padding: '0.80rem clamp(0.20rem, 1.5vw, 0.5rem)',
          margin: '0 0.5rem',
        }}
      >
        {/* Balance */}
        <div
          data-balance-area
          className="d-flex align-items-center gap-1 px-2 py-1  rounded-pill flex-shrink-0 select-none"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            fontSize: 'clamp(8px, 1vw, 14px)',
            width: '22%',
          }}>
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 'clamp(24px, 2vw, 28px)',
              height: 'clamp(24px, 2vw, 28px)',
              background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
              fontSize: 'clamp(12px, 1.2vw, 18px)',
            }}
          >
            <span className="fw-bold" style={{ color: '#000' }}>G</span>
          </div>
          <div className="d-flex flex-column  ">
            <small className="text-secondary text-white" style={{ fontSize: 'clamp(10px, 1.2vw, 10px)' }}>
              Balance
            </small>
            <span className="text-white fw-bold" style={{ fontSize: 'clamp(12px, 1.5vw, 14px)' }}>
              {userPlayerData?.data?.balance?.toLocaleString() || '0'}
            </span>
          </div>
        </div>

        {/* Coins */}
        {bettingCoins.map((amount: number, index: number) => (
          <CoinButton
            key={amount}
            amount={amount}
            color={colors[index % colors.length]}
            isSelected={selectedCoin === amount}
            onClick={() => onClickCoin(amount, colors[index % colors.length])}
          />
        ))}
      </div>
      <ToastContainer />
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
