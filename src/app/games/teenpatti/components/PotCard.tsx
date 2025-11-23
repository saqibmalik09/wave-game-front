//PotCard.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { placeBet } from '@/lib/redux/slices/teenpatti/teenPattiBettingSlice';
import { SoundManager } from '../game/SoundManager';
import { useToast } from './Toast';
import { clearPendingCoin } from '@/lib/redux/slices/teenpatti/coinDropAnimation';

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
  const pendingCoin = useSelector((state: RootState) => state.coinAnimation.pendingCoin);
  const { ToastContainer, showToast } = useToast();
  const coinsContainerRef = useRef<HTMLDivElement>(null);

  const bettingCoins: number[] = gameConfig?.bettingCoins || [];
  const colors: string[] = gameConfig?.colors || [];
  const tableBackgroundImage = gameConfig?.tableBackgroundImage;

  const coinColorMap: Record<number, string> = {};
  bettingCoins.forEach((value, index) => {
    coinColorMap[value] = colors[index % colors.length];
  });

  const [coins, setCoins] = useState<CoinData[]>([]);
  const [coinIdCounter, setCoinIdCounter] = useState(0);
  const apiCoinsAnimated = useRef(false);
  const previousPhase = useRef(currentPhase);
  const [displayCards, setDisplayCards] = useState<string[]>(cardBackImages);

  // ✅ Clear coins when phase changes
  useEffect(() => {
    if (currentPhase !== 'bettingTimer') {
      setCoins([]);
      apiCoinsAnimated.current = false;
    }
  }, [currentPhase]);

  // ✅ Initial coin drop animation (API coins)
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
          if (!coinsContainerRef.current) return;
          const containerWidth = coinsContainerRef.current.offsetWidth;
          const containerHeight = coinsContainerRef.current.offsetHeight;
          
          const newCoin: CoinData = {
            id: coinIdCounter + idx,
            value: coinValue,
            x: Math.random() * (containerWidth * 0.75),
            y: Math.random() * (containerHeight * 0.5),
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

  // ✅ Listen for server response and animate user coin
  useEffect(() => {
    if (pendingCoin && pendingCoin.potIndex === potIndex) {
      SoundManager.getInstance().play('betButtonAndCardClickSound');

      if (!coinsContainerRef.current) {
        dispatch(clearPendingCoin());
        return;
      }

      const containerWidth = coinsContainerRef.current.offsetWidth;
      const containerHeight = coinsContainerRef.current.offsetHeight;

      const newCoinId = coinIdCounter;
      setCoinIdCounter(prev => prev + 1);

      const newUserCoin: CoinData = {
        id: newCoinId,
        value: pendingCoin.value,
        x: Math.random() * (containerWidth * 0.75),
        y: Math.random() * (containerHeight * 0.5),
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

      dispatch(clearPendingCoin());
    }
  }, [pendingCoin, potIndex, coinIdCounter, dispatch]);

  // ✅ Card flip animation
  useEffect(() => {
    if (currentPhase === 'resultAnnounceTimer') {
      setDisplayCards(cardBackImages);
      const timer = setTimeout(() => {
        setDisplayCards(cardImages);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setDisplayCards(cardBackImages);
    }
  }, [currentPhase, cardBackImages, cardImages]);

  // ✅ Handle pot click - ONLY dispatch bet, NO animation here
  const handlePotClick = () => {
    if (!selectedCoin) {
      showToast(`Please select a coin to bet!`);
      return;
    }

    if (currentPhase !== 'bettingTimer') {
      showToast(`Betting closed. Wait`);
      return;
    }

    const selectedCoinAmount = selectedCoin.amount;

    // ✅ ONLY dispatch bet - coin animation will happen when server responds
    dispatch(
      placeBet({
        userId: '10007',
        amount: selectedCoinAmount,
        tableId: 10,
        betType: 1,
        potIndex
      })
    );
  };

  return (
    <div
      className="position-relative"
      style={{
        width: 'clamp(180px, 5%, 200px)',
        aspectRatio: '0.74',
        padding: '3px',
        background: isWinner && currentPhase === "resultAnnounceTimer"
          ? 'linear-gradient(180deg, #2d7a2d 0%, #1a4d1a 100%)'
          : 'linear-gradient(180deg, #6b1f2b 0%, #4a1520 100%)',
        border: isWinner && currentPhase === "resultAnnounceTimer"
          ? '2px solid #22c55e' 
          : '1px solid rgba(255, 153, 102, 0.3)',
        boxShadow: isWinner && currentPhase === "resultAnnounceTimer"
          ? '0 0 30px rgba(34, 197, 94, 0.5), 0 12px 30px rgba(0, 0, 0, 0.5)'
          : '0 12px 30px rgba(0, 0, 0, 0.5)',
        cursor: currentPhase === 'bettingTimer' ? 'pointer' : 'not-allowed',
        transition: 'all 0.3s ease',
        opacity: currentPhase === 'bettingTimer' ? 1 : 0.8,
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={handlePotClick}
    >
      {/* Header */}
      <div 
        className="text-center" 
        style={{ 
          marginBottom: '8px',
          flex: '0 0 auto'
        }}
      >
        <div 
          className="text-warning fw-bold" 
          style={{ 
            fontSize: '10px',
            lineHeight: '1.2'
          }}
        >
          {potName.toUpperCase()}
        </div>
        <div
          className="badge mt-1"
          style={{
            background: 'rgba(0,0,0,0.5)',
            fontSize: '12px',
            color: '#ffd78b',
            padding: '4px 10px',
            lineHeight: '1.2'
          }}
        >
          Pot: ₹{totalBet.toLocaleString()}
        </div>
      </div>

      {/* Cards */}
      <div 
        className="d-flex justify-content-center" 
        style={{ 
          gap: '6px',
          marginBottom: '0px',
          flex: '0 0 auto'
        }}
      >
        {displayCards.map((cardUrl, idx) => (
          <div
            key={idx}
            className="overflow-hidden card-flip"
            style={{
              width: 'clamp(50px, 10%, 50px)',
              height: 'clamp(70px, 31%, 100px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              borderRadius: '6px',
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

      {/* Coins Container */}
      <div
        ref={coinsContainerRef}
        className="position-relative mx-auto"
        style={{
          width: '100%',
          marginTop: "5px",
          height: 'clamp(50px, 20%, 100px)',
          background: 'rgba(0,0,0,0.3)',
          overflow: 'hidden',
          borderRadius: '8px',
          flex: '1 1 auto',
          minHeight: '50px',
          maxHeight: '80%',
        }}
      >
        {coins.map(coin => {
          const thisCoinColor = coinColorMap[coin.value] || '#ffffff55';
          return (
            <div
              key={coin.id}
              className="position-absolute rounded-circle d-flex align-items-center justify-content-center fw-bold text-white select-none"
              style={{
                width: '23px',
                height: '23px',
                left: `${coin.x}px`,
                top: `${coin.y}px`,
                background: `radial-gradient(circle at 30% 30%, ${thisCoinColor}, ${thisCoinColor}dd)`,
                border: '2px solid rgba(255,255,255,0.3)',
                fontSize: '10px',
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