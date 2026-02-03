import React, { useEffect, useState } from 'react';

interface CoinAnimationProps {
  id: string;
  amount: number;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onComplete: () => void;
  stayDuration?: number;
}

export const CoinAnimation: React.FC<CoinAnimationProps> = ({  
  id,
  amount,
  color,
  startX,
  startY,
  endX,
  endY,
  onComplete,
  stayDuration = 0
}) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [finalPosition] = useState(() => {
    const randomX = (Math.random() - 0.5) * 15;
    const randomY = (Math.random() - 0.5) * 15;
    return { x: randomX, y: randomY };
  });

  useEffect(() => {
    const animTimer = setTimeout(() => {
      setIsAnimating(false);
      onComplete();
    }, 500);

    const removeTimer = setTimeout(() => {
      onComplete();
    }, 600 + stayDuration);

    return () => {
      clearTimeout(animTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete, stayDuration]);

  const finalX = endX + finalPosition.x;
  const finalY = endY + finalPosition.y;
  const midX = (startX + finalX) / 2;
  const midY = (startY + finalY) / 2 - 40;

  if (isAnimating) {
    return (
      <>
        <style jsx>{`
          @keyframes flyTo-${id} {
            0% {
              left: ${startX}px;
              top: ${startY}px;
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            50% {
              left: ${midX}px;
              top: ${midY}px;
              transform: translate(-50%, -50%) scale(1.15);
              opacity: 1;
            }
            100% {
              left: ${finalX}px;
              top: ${finalY}px;
              transform: translate(-50%, -50%) scale(0.85);
              opacity: 1;
            }
          }
        `}</style>
        <div
          className="fixed pointer-events-none z-[50] w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-white text-xs shadow-lg"
          style={{
            backgroundColor: color,
            animation: `flyTo-${id} 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
          }}
        >
          {amount >= 1000 ? `${amount / 1000}k` : amount}
        </div>
      </>
    );
  }

  return (
    <div
      className="fixed pointer-events-none z-[50] w-6 h-6 rounded-full flex items-center justify-center font-extrabold text-white text-xs shadow-lg"
      style={{
        backgroundColor: color,
        left: `${finalX}px`,
        top: `${finalY}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {amount >= 1000 ? `${amount / 1000}k` : amount}
    </div>
  );
};