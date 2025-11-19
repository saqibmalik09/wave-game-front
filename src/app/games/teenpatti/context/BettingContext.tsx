'use client';

import React, { createContext, useContext, useRef, useCallback } from 'react';

interface BettingContextType {
  selectedCoinRef: React.MutableRefObject<number>;
  setSelectedCoin: (amount: number) => void;
  getSelectedCoin: () => number;
}

const BettingContext = createContext<BettingContextType | null>(null);

export function BettingProvider({ children }: { children: React.ReactNode }) {
  const selectedCoinRef = useRef<number>(10);

  const setSelectedCoin = useCallback((amount: number) => {
    selectedCoinRef.current = amount;
  }, []);

  const getSelectedCoin = useCallback(() => {
    return selectedCoinRef.current;
  }, []);

  return (
    <BettingContext.Provider value={{ selectedCoinRef, setSelectedCoin, getSelectedCoin }}>
      {children}
    </BettingContext.Provider>
  );
}

export const useBetting = () => {
  const context = useContext(BettingContext);
  if (!context) throw new Error('useBetting must be used within BettingProvider');
  return context;
};