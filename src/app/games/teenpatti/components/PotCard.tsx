//PotCard.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { placeBet } from '@/lib/redux/slices/teenpatti/teenPattiBettingSlice';
import { SoundManager } from '../game/SoundManager';
import { useToast } from './Toast';
import { clearPendingCoin } from '@/lib/redux/slices/teenpatti/coinDropAnimation';
import { placeTeenpattiBet } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';

interface PotCardProps {
  potIndex: number;
  potName: string;
  totalBet: number;
  myBet: number;
  betCoins: number[];
  cardImages: string[];
  cardBackImages: string[];
  isWinner: boolean;
  // rankText?: string;
  // multiplier: number;
  // onPotClick: () => void;
  // showFront: boolean;
}

interface CoinData {
  id: number;
  value: number;
  x: number;
  y: number;
  isAnimating: boolean;
  potIndex?: number;
}
interface PendingCoin {
  value: number;
  potIndex: number;
}
export default function PotCard({
  potIndex,
  potName,
  totalBet,
  myBet,
  betCoins,
  cardImages,
  cardBackImages,
  isWinner,
  // rankText,
  // multiplier,
  // onPotClick,
  // showFront,
}: PotCardProps) {
  const dispatch = useDispatch();
  const selectedCoin = useSelector((s: RootState) => s.selectedCoin.coin);
  const currentPhase = useSelector((s: RootState) => s.teenpattiTimer.phase);
  const gameConfig = useSelector((s: RootState) => s.gameConfiguration.data);
  const pendingCoin = useSelector<RootState, PendingCoin | null>((state) => state.coinAnimation.pendingCoin);
  const { ToastContainer, showToast } = useToast();
  const coinsContainerRef = useRef<HTMLDivElement>(null);
  const userPlayerData = useSelector((state: RootState) => state.userPlayerData);
  const tenant = useSelector((state: RootState) => state.tenantDetails.data);
  const currentUserId = userPlayerData.data?.id;
  const bettingCoins: number[] = gameConfig?.bettingCoins || [];
  const colors: string[] = gameConfig?.colors || [];
  const tableBackgroundImage = gameConfig?.tableBackgroundImage;
  const [announcedWinner, setAnnouncedWinner] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  const coinColorMap: Record<number, string> = {};
  bettingCoins.forEach((value, index) => {
    coinColorMap[value] = colors[index % colors.length];
  });

  const [coins, setCoins] = useState<CoinData[]>([]);
  const [coinIdCounter, setCoinIdCounter] = useState(0);
  const apiCoinsAnimated = useRef(false);
  const previousPhase = useRef(currentPhase);
  const [displayCards, setDisplayCards] = useState<string[]>(cardBackImages);
  const [isCollecting, setIsCollecting] = useState(false);
  //  Clear coins when phase changes
  useEffect(() => {
    if (!isWinner) return;

    // prevent duplicate announcement
    if (announcedWinner === winner) return;
    setAnnouncedWinner(winner);
  }, [isWinner]);
  useEffect(() => {
    if (currentPhase !== 'bettingTimer') {
      if (!(currentPhase === 'resultAnnounceTimer' && isWinner)) {
        apiCoinsAnimated.current = false;
        setIsCollecting(false);
      }
    }
  }, [currentPhase, isWinner]);
  useEffect(() => {
    if (currentPhase == "winningCalculationTimer") {
      setCoins([]);
    }
    if (currentPhase === 'resultAnnounceTimer' && isWinner && coins.length > 0) {
      setIsCollecting(true);

      // After collection animation, clear coins
      const timer = setTimeout(() => {
        // Coins will be cleared after flying animation
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [currentPhase, isWinner, coins.length]);
  //  Initial coin drop animation (API coins)
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

  //  Listen for server response and animate user coin
  useEffect(() => {
    if (pendingCoin && pendingCoin.potIndex === potIndex) {
      SoundManager.getInstance().play('potClickSound');

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

  //  Card flip animation
  useEffect(() => {
    if (currentPhase === 'resultAnnounceTimer') {
      setDisplayCards(cardBackImages);
      const timer = setTimeout(() => {
        setDisplayCards(cardImages);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setDisplayCards(cardBackImages);
    }
  }, [currentPhase, cardBackImages, cardImages]);

  const handlePotClick = () => {
    if (!selectedCoin) {
      showToast(`Please select a coin to bet!`);
      return;
    }
    const balance = Number(userPlayerData.data?.balance || 0);
    const betAmount = Number(selectedCoin.amount);

    if (!selectedCoin) {
      showToast(`Please select a coin to bet!`);
      return;
    }

    if (balance <= 0) {
      showToast(`Insufficient balance.`);
      return;
    }

    if (betAmount > balance) {
      showToast(`Insufficient balance.`);
      return;
    }


    const params = new URLSearchParams(window.location.search);
    const appKey = params.get("appKey");
    const gameId = params.get("gameId");
    const token = params.get("token");


    if (currentPhase !== 'bettingTimer') {
      showToast(`Betting closed. Wait`);
      return;
    }
    if (!currentUserId) {
      showToast(`User not found. Cannot place bet.`);
      return;
    }
    const selectedCoinAmount = selectedCoin.amount;
    const tenantBaseURL =
      tenant.environemnt === "production"
        ? tenant.tenantProductionDomain
        : tenant.tenantTestingDomain;

    let betData = {
      userId: currentUserId.toString(),
      amount: selectedCoinAmount,
      tableId: 10,
      betType: 1,
      potIndex: String(potIndex),
      socketId: "",
      appKey: appKey!,
      token: token!,
      gameId: gameId!,
      tenantBaseURL,
    }
    dispatch(placeBet({
      userId: currentUserId.toString(),
      amount: selectedCoinAmount,
      tableId: 10,
      betType: 1,
      potIndex: potIndex,
    }));
    placeTeenpattiBet(betData);

  };


  return (
    <div
      data-pot-index={potIndex}
      className={`relative flex flex-col rounded-2xl transition-all duration-300 border-2 pb-7 ${isWinner && currentPhase === 'resultAnnounceTimer'
        ? 'bg-gradient-to-b from-yellow-700 to-yellow-900 border-yellow-500 shadow-[0_0_30px_rgba(34,197,94,0.5)]'
        : 'bg-[#701523] border-[#A24452]'
        } ${currentPhase === 'bettingTimer' ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-80'
        }`}
      style={{
        width: '128px',
        minHeight: '168px',
        maxHeight: '180px',
      }}
      onClick={handlePotClick}
    >
      {/* Pot Header - Single Line */}
       <div className={`rounded-t-xl px-2 py-0.5 text-center border-b border-slate-600
          ${isWinner && currentPhase === 'resultAnnounceTimer'
            ? 'bg-yellow-500'
            : 'bg-[#9E2D3F]'
          }`}>
        <div className="text-white font-bold text-[7px] sm:text-xs whitespace-nowrap">
          POT {totalBet.toLocaleString()}
        </div>
      </div>

      {/* Cards Section - Larger & More Visible, Minimal Spacing */}
      <div className="relative flex justify-center items-start mt-0.5" style={{ height: '70px' }}>
        {displayCards.map((cardUrl, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              width: '53px',        // larger than before
              height: '70px',       // larger than before
              left: `${idx * 35}px`, // 50% overlap (42px / 2 ≈ 21)
              zIndex: idx,
            }}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${cardUrl}`}
              alt={`Card ${idx}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Coins Container - No Background, Maximum Width */}
      <div
        ref={coinsContainerRef}
        className="absolute left-0 right-0 mx-0.2 rounded-lg overflow-hidden"
        style={{
          top: 'calc(70px + 16px)', // ⬅ EXACTLY where cards end (adjust if needed)
          height: '42%',           // ⬅ now grows ONLY DOWN
          width: 'calc(100% - 1px)',
        }}
      >

        {/* Multiplier as placeholder text when no coins */}
        {coins.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-amber-500 font-bold text-xs opacity-40">
            2.9x
          </div>
        )}

        {coins.map(coin => {
          const thisCoinColor = coinColorMap[coin.value] || '#94a3b8';
          const containerWidth = coinsContainerRef.current?.offsetWidth || 76;
          const centerX = containerWidth / 2 - 9; // 9 = half of coin width (18px)
          const centerY = -20;
          return (
            <div
              key={coin.id}
              className={`absolute rounded-full flex items-center justify-center font-bold text-white select-none shadow-lg ${coin.isAnimating ? 'coin-drop' : ''
                } ${isCollecting ? 'coin-collect' : ''}`}
              style={{
                width: '18px',
                height: '18px',
                left: isCollecting ? `${centerX}px` : `${coin.x}px`,
                top: isCollecting ? `${centerY}px` : `${coin.y}px`,
                background: `radial-gradient(circle at 30% 30%, ${thisCoinColor}, ${thisCoinColor}dd)`,
                border: '2px solid rgba(255,255,255,0.4)',
                fontSize: '7px',
                transition: isCollecting ? 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                zIndex: isCollecting ? 10 : 1,
              }}
            >
              {coin.value >= 1000 ? `${coin.value / 1000}k` : coin.value}
            </div>
          );
        })}

      </div>
      {/* my bet total here  */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div className="bg-opacity-50 text-white text-xs px-0.5 py-0.5 rounded">
          My Bet: {myBet.toLocaleString()}
        </div>
      </div>

      <style jsx>{`
  @keyframes coinDrop {
    0% {
      transform: translateY(-60px) scale(0.85);
      opacity: 0;
    }
    70% {
      transform: translateY(6px) scale(1.05);
      opacity: 1;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  .coin-drop {
    animation: coinDrop 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
  }
`}</style>

      <ToastContainer />
    </div>
  );
}