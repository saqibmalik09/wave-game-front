// components/CoinsAnimation.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';

interface FlyingCoin {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
}

interface CoinsAnimationProps {
  isActive: boolean;
  amount: number;
  potIndex: number;
  onComplete: () => void;
}

export const CoinsAnimation: React.FC<CoinsAnimationProps> = ({
  isActive,
  amount,
  potIndex,
  onComplete,
}) => {
  const [coins, setCoins] = useState<FlyingCoin[]>([]);
  const [showAmountText, setShowAmountText] = useState(false);
  const [amountPosition, setAmountPosition] = useState({ x: 0, y: 0 });
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) return;

    const potElements = document.querySelectorAll('[data-pot-index]');
    const potElement = Array.from(potElements).find(
      (el) => el.getAttribute('data-pot-index') === String(potIndex)
    ) as HTMLElement;

    const balanceElement = document.querySelector('[data-balance-area]') as HTMLElement;

    if (!potElement || !balanceElement) {
      onCompleteRef.current();
      return;
    }

    const potRect = potElement.getBoundingClientRect();
    const balanceRect = balanceElement.getBoundingClientRect();

    const startX = potRect.left + potRect.width / 2;
    const startY = potRect.top;
    const endX = balanceRect.left + balanceRect.width / 2;
    const endY = balanceRect.top + balanceRect.height / 2;

    // ✅ Set position for amount text (above balance)
    setAmountPosition({
      x: endX,
      y: balanceRect.top - 15, //15px above balance
    });

    const newCoins: FlyingCoin[] = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      startX: startX + (Math.random() - 0.5) * 20,
      startY: startY + (Math.random() - 0.5) * 20,
      endX: endX + (Math.random() - 0.5) * 30,
      endY: endY + (Math.random() - 0.5) * 20,
      delay: i * 80,
    }));

    setCoins(newCoins);

    // ✅ Show amount text slightly after coins start flying
    setTimeout(() => {
      setShowAmountText(true);
    }, 300);

    const totalDuration = 800 + 10 * 80;
    const timer = setTimeout(() => {
      setCoins([]);
      setShowAmountText(false);
      onCompleteRef.current();
    }, totalDuration);

    return () => {
      clearTimeout(timer);
      setShowAmountText(false);
    };
  }, [isActive, potIndex]);

  if (!isActive || coins.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {/* Flying Coins */}
      {coins.map((coin) => (
        <div
          key={coin.id}
          className="absolute"
          style={{
            left: `${coin.startX}px`,
            top: `${coin.startY}px`,
            animation: `flyToBalance 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${coin.delay}ms forwards`,
            '--end-x': `${coin.endX - coin.startX}px`,
            '--end-y': `${coin.endY - coin.startY}px`,
          } as React.CSSProperties}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #ffd700, #ffed4e)',
              border: '2px solid rgba(255, 215, 0, 0.8)',
              fontSize: '10px',
              color: '#000',
            }}
          >
            G
          </div>
        </div>
      ))}

      {/* ✅ Amount Text Animation */}
      {showAmountText && (
        <div
          className="absolute font-bold text-xl"
          style={{
            left: `${amountPosition.x}px`,
            top: `${amountPosition.y}px`,
            transform: 'translate(-50%, 0)',
            animation: 'floatUpAmount 1.5s ease-in forwards',
            color: '#ffd700',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.8)',
            fontWeight: 900,
            letterSpacing: '1px',
          }}
        >
          +{amount.toLocaleString()}
        </div>
      )}

      <style jsx>{`
        @keyframes flyToBalance {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(
              calc(var(--end-x) * 0.5),
              calc(var(--end-y) * 0.5 - 50px)
            ) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes floatUpAmount {
          0% {
            opacity: 0;
            transform: translate(-50%, 0) scale(0.5);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -10px) scale(1.2);
          }
          40% {
            transform: translate(-50%, -15px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -40px) scale(0.8);
          }
        }
      `}</style>
    </div>
  );
};