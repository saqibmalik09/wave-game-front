// useCoinAnimations.ts
import { useState, useCallback, useRef } from 'react';

interface Animation {
  id: string;
  amount: number;
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const useCoinAnimations = () => {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const counterRef = useRef(1);

  const animateCoin = useCallback((
    amount: number,
    color: string,
    targetElement: HTMLElement,
    customStartX?: number,
    customStartY?: number
  ) => {
    const rect = targetElement.getBoundingClientRect();

    counterRef.current += 1;
    const id = `coin-${counterRef.current}`;

    const startX = customStartX ?? (window.innerWidth / 2);
    const startY = customStartY ?? (window.innerHeight - 60);

    const endX = rect.left + rect.width / 2;
    const endY = rect.top + rect.height / 2;


    setAnimations(prev => [
      ...prev,
      { id, amount, color, startX, startY, endX, endY }
    ]);
  }, []);

  const removeAnimation = useCallback((id: string) => {
    setAnimations(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAllAnimations = useCallback(() => {
    console.log(' Clearing all coins');
    setAnimations([]);
  }, []);

  return { animations, animateCoin, removeAnimation, clearAllAnimations };
};