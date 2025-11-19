//potCard.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { placeBet } from '@/lib/redux/slices/teenpatti/teenPattiBettingSlice';
import { SoundManager } from '../game/SoundManager';
import { useToast } from './Toast';

interface PotCardProps {
  potIndex: number;
  potName: string;
  totalBet: number;
  betCoins: number[];
  cardImages: string[];
  cardBackImages: string[];
  isWinner: boolean;
  rankText?: string;
  multiplier: number;
  onPotClick: () => void;
  showFront: boolean;
}

interface CoinData {
  id: number;
  value: number;
  x: number;
  y: number;
  isAnimating: boolean;
}

export default function PotCard({
  potIndex,
  potName,
  totalBet,
  betCoins,
  cardImages,
  cardBackImages,
  isWinner,
  rankText,
  multiplier,
  onPotClick,
  showFront,
}: PotCardProps) {
  const dispatch = useDispatch();
  const selectedCoin = useSelector((s: RootState) => s.selectedCoin.coin);
  const currentPhase = useSelector((s: RootState) => s.teenpattiTimer.phase);
  const gameConfig = useSelector((s: RootState) => s.gameConfiguration.data);
  const { ToastContainer, showToast } = useToast();

  const bettingCoins: number[] = gameConfig?.bettingCoins || [];
  const colors: string[] = gameConfig?.colors || [];

  const coinColorMap: Record<number, string> = {};
  bettingCoins.forEach((value, index) => {
    coinColorMap[value] = colors[index % colors.length];
  });

  const [coins, setCoins] = useState<CoinData[]>([]);
  const [coinIdCounter, setCoinIdCounter] = useState(0);
  const apiCoinsAnimated = useRef(false);
  const previousPhase = useRef(currentPhase);

  // Cards state
  const [displayCards, setDisplayCards] = useState<string[]>(cardBackImages);

  // Clear coins when phase is not bettingTimer
  useEffect(() => {
    if (currentPhase !== 'bettingTimer') {
      setCoins([]);
      apiCoinsAnimated.current = false;
    }
  }, [currentPhase]);

  // Animate API coins once per bettingTimer
  useEffect(() => {
    const phaseJustStarted =
      previousPhase.current !== 'bettingTimer' && currentPhase === 'bettingTimer';
    previousPhase.current = currentPhase;

    if (phaseJustStarted && !apiCoinsAnimated.current && betCoins.length > 0) {
      apiCoinsAnimated.current = true;

      const totalDuration = 4000;
      const bunchSize = Math.ceil(betCoins.length / 3);

      betCoins.forEach((coinValue, idx) => {
        const bunchIndex = Math.floor(idx / bunchSize);
        const delayWithinBunch = (idx % bunchSize) * 100;
        const bunchDelay = bunchIndex * (totalDuration / 3);

        setTimeout(() => {
          const newCoin: CoinData = {
            id: coinIdCounter + idx,
            value: coinValue,
            x: Math.random() * 160,
            y: Math.random() * 40,
            isAnimating: true,
          };

          setCoins(prev => [...prev, newCoin]);

          setTimeout(() => {
            setCoins(prev =>
              prev.map(c =>
                c.id === newCoin.id ? { ...c, isAnimating: false } : c
              )
            );
          }, 500);
        }, bunchDelay + delayWithinBunch);
      });

      setCoinIdCounter(prev => prev + betCoins.length);
    }
  }, [currentPhase, betCoins]);

  // Handle card flip during resultAnnounceTimer
  useEffect(() => {
    if (currentPhase === 'resultAnnounceTimer') {
      // Wait 2s before flip
      setDisplayCards(cardBackImages); // start with back
      const timer = setTimeout(() => {
        setDisplayCards(cardImages); // flip to front
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      // Non-result phases → show back
      setDisplayCards(cardBackImages);
    }
  }, [currentPhase, cardBackImages, cardImages]);

  const handlePotClick = () => {
    if (!selectedCoin) {
      showToast(`Please select a coin to bet!`);
      return;
    }

    if (currentPhase !== 'bettingTimer') {
      showToast(`Betting closed. Wait`);
      return;
    }

    SoundManager.getInstance().play('betButtonAndCardClickSound');
    const selectedCoinAmount = selectedCoin.amount;

    const newCoinId = coinIdCounter;
    setCoinIdCounter(prev => prev + 1);

    const newUserCoin: CoinData = {
      id: newCoinId,
      value: selectedCoinAmount,
      x: Math.random() * 160,
      y: Math.random() * 40,
      isAnimating: true,
    };

    setCoins(prev => [...prev, newUserCoin]);

    setTimeout(() => {
      setCoins(prev =>
        prev.map(c =>
          c.id === newCoinId ? { ...c, isAnimating: false } : c
        )
      );
    }, 500);

    dispatch(
      placeBet({
        userId: '10007',
        amount: selectedCoinAmount,
        tableId: 10,
        betType: 'player',
      })
    );

    onPotClick();
  };

  return (
    <div
      className="position-relative rounded-4 p-3"
      style={{
        width: '280px',
        height: '380px',
        background: isWinner
          ? 'linear-gradient(180deg, #2d7a2d 0%, #1a4d1a 100%)'
          : 'linear-gradient(180deg, #6b1f2b 0%, #4a1520 100%)',
        border: isWinner ? '3px solid #22c55e' : '2px solid rgba(255, 153, 102, 0.3)',
        boxShadow: isWinner
          ? '0 0 30px rgba(34, 197, 94, 0.5), 0 12px 30px rgba(0, 0, 0, 0.5)'
          : '0 12px 30px rgba(0, 0, 0, 0.5)',
        cursor: currentPhase === 'bettingTimer' ? 'pointer' : 'not-allowed',
        transition: 'all 0.3s ease',
        opacity: currentPhase === 'bettingTimer' ? 1 : 0.8,
      }}
      onClick={handlePotClick}
    >
      {/* Header */}
      <div className="text-center mb-3">
        <div className="text-warning fw-bold" style={{ fontSize: '14px' }}>
          {potName.toUpperCase()}
        </div>
        <div
          className="badge mt-1 px-3 py-1"
          style={{
            background: 'rgba(0,0,0,0.5)',
            fontSize: '13px',
            color: '#ffd78b',
          }}
        >
          Pot: ₹{totalBet.toLocaleString()}
        </div>
      </div>

      {/* Cards */}
      <div className="d-flex justify-content-center gap-2 mb-3">
        {displayCards.map((cardUrl, idx) => (
          <div
            key={idx}
            className={`rounded-3 overflow-hidden card-flip`}
            style={{
              width: '70px',
              height: '100px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
            }}
          >
            <img
              src={cardUrl}
              alt={`Card ${idx}`}
              className="w-100 h-100"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* Coins */}
      <div
        className="position-relative mx-auto mb-3 rounded-3"
        style={{
          width: '200px',
          height: '80px',
          background: 'rgba(0,0,0,0.3)',
          overflow: 'hidden',
        }}
      >
        {coins.map(coin => {
          const thisCoinColor = coinColorMap[coin.value] || '#ffffff55';
          return (
            <div
              key={coin.id}
              className="position-absolute rounded-circle d-flex align-items-center justify-content-center fw-bold text-white select-none"
              style={{
                width: '40px',
                height: '40px',
                left: `${coin.x}px`,
                top: `${coin.y}px`,
                background: `radial-gradient(circle at 30% 30%, ${thisCoinColor}, ${thisCoinColor}dd)`,
                border: '2px solid rgba(255,255,255,0.3)',
                fontSize: '11px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                transform: coin.isAnimating ? 'translateY(-50px)' : 'translateY(0)',
                opacity: coin.isAnimating ? 0 : 1,
                animation: coin.isAnimating ? 'coinDrop 0.5s forwards' : 'none',
              }}
            >
              {coin.value >= 1000 ? `${coin.value / 1000}k` : coin.value}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes coinDrop {
          0% { transform: translateY(-50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* Card flip + vibrate effect */
        .card-flip {
          transition: transform 0.6s ease;
        }
        .card-flip.flip {
          transform: rotateY(180deg) translateX(2px);
          animation: vibrate 0.2s linear 0s 4;
        }

        @keyframes vibrate {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          50% { transform: rotate(-1deg); }
          75% { transform: rotate(1deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>

      <ToastContainer />
    </div>
  );
}
