'use client';

import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

type Props = {
  state: 'fast' | 'weak' | 'offline';
};

export default function NetworkStatus({ state }: Props) {
  if (state === 'fast') return null;

  const isOffline = state === 'offline';
  return (
    <div
      className={clsx(
        'fixed top-2 left-1/2 -translate-x-1/2 z-[70]',
        'px-2 py-2 rounded-full shadow-lg',
        'flex items-center gap-1 text-sm font-medium',
        'backdrop-blur-md transition-all duration-300',
        isOffline
          ? 'bg-red-600/90 text-white'
          : 'bg-yellow-400/90 text-black'
      )}
    >
      {isOffline ? (
        <WifiOff size={16} />
      ) : (
        <AlertTriangle size={16} />
      )}

      <span>
        {isOffline
          ? 'You are offline'
          : 'Weak internet connection'}
      </span>
    </div>
  );
}
