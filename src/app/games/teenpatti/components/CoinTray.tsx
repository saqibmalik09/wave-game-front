'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCoin } from '@/lib/redux/slices/teenpatti/selectedCoinSlice';
import { SoundManager } from '../game/SoundManager';
import { RootState } from '@/lib/redux/store';
import { myMessagesFromServer } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';
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
        transition: 'all 0.2s ease',
        transform: isSelected ? 'translateY(-8%) scale(1.05)' : 'none',
        flexShrink: 1,
      }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white"
        style={{
          width: 'clamp(18px, 6vw, 50px)',
          height: 'clamp(18px, 6vw, 50px)',
          fontSize: 'clamp(4px, 2.1vw, 16px)',
          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}dd)`,
          // border: `clamp(1px, 0.3vw, 4px) solid rgba(255, 255, 255, 0.3)`,
          // boxShadow: isSelected
          //   ? `0 0.5rem 1.5rem ${color}88, 0 0 1rem ${color}66`
          //   : `0 0.25rem 0.75rem rgba(0, 0, 0, 0.4)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {displayAmount}
      </div>

      {isSelected && (
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x rounded-circle"
          style={{
            width: 'clamp(6px, 1.5vw, 8px)',
            height: 'clamp(6px, 1.5vw, 8px)',
            background: '#ffd700',
            animation: 'pulse 1.5s infinite',
          }}
        />
      )}
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
    myMessagesFromServer((message)=>{
      showToast(`You won ${message.winningAmount}`,'success')
    })
     const onClickCoin = (amount: number, color: string) => {
      SoundManager.getInstance().play('betButtonAndCardClickSound');

    setSelectedCoinLocal(amount);
    dispatch(setCoin({ amount, color }));
  };

  return (
    <div
      className="position-fixed bottom-0 start-50 translate-middle-x mb-0"
      style={{ zIndex: 50, width: '100%', maxWidth: '100%' }}
    >
      <div
        className="rounded-pill d-flex align-items-center gap-1 justify-content-center flex-nowrap"
        style={{
          // background: 'rgba(0, 0, 0, 0.7)',
          // backdropFilter: 'blur(10px)',
          // boxShadow: '0 0.5rem 2rem rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          padding: '0.15rem clamp(0.20rem, 1.5vw, 0.5rem)',
          margin: '0 0.5rem',
        }}
      >
        {/* Balance */}
        <div
          className="d-flex align-items-center gap-1 px-2 py-1 rounded-pill flex-shrink-0 select-none"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            fontSize: 'clamp(6px, 2vw, 14px)',
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: 'clamp(20px, 4vw, 36px)',
              height: 'clamp(20px, 4vw, 36px)',
              background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
              fontSize: 'clamp(6px, 1.5vw, 14px)',
            }}
          >
            <span className="fw-bold" style={{ color: '#000' }}>G</span>
          </div>
          <div className="d-flex flex-column  ">
            <small className="text-secondary" style={{ fontSize: 'clamp(5px, 1.2vw, 10px)' }}>
              Balance
            </small>
            <span className="text-white fw-bold" style={{ fontSize: 'clamp(6px, 1.5vw, 14px)' }}>
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
