'use client';

import { useEffect, useRef, useState } from 'react';

type NetworkState = 'fast' | 'weak' | 'offline';

export function useRealtimeNetwork(intervalMs = 5000) {
  const [state, setState] = useState<NetworkState>('fast');
  const lastState = useRef<NetworkState>('fast');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout | null = null;

    const checkNetwork = async () => {
      let newState: NetworkState = 'fast';
      if (!navigator.onLine) {
        newState = 'offline';
      } else {
        try {
          const controller = new AbortController();
          timeoutId = setTimeout(() => controller.abort(), 3000);

          const start = performance.now();

          await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api`,
            {
              method: 'GET',
              cache: 'no-store',
              signal: controller.signal,
            }
          );

          const latency = performance.now() - start;

          if (latency > 1500) {
            newState = 'weak';
          }
        } catch {
          // 🔥 REAL INTERNET FAILURE
          newState = 'offline';
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
      }

      /* 2️⃣ CONNECTION API (ONLY IF NOT OFFLINE) */
      if (newState !== 'offline') {
        const connection = (navigator as any).connection;
        if (connection) {
          const { effectiveType, rtt, downlink } = connection;
          if (
            ['slow-2g', '2g', '3g'].includes(effectiveType) ||
            rtt > 1200 ||
            downlink < 1
          ) {
            newState = 'weak';
          }
        }
      }

      if (lastState.current !== newState) {
        lastState.current = newState;
        setState(newState);
      }
    };

    checkNetwork();
    const interval = setInterval(checkNetwork, intervalMs);

    /* 3️⃣ IMMEDIATE OFFLINE EVENT */
    const handleOffline = () => {
      lastState.current = 'offline';
      setState('offline');
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', checkNetwork);

    return () => {
      clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', checkNetwork);
    };
  }, [intervalMs]);

  return state;
}
