// useAutoPlayerBets.ts
import { useEffect, useRef } from 'react';
import { WheelRef } from './Wheel';

const AMOUNTS = [100, 500, 1000, 5000, 50000];
const COLORS = ['#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ef4444'];

export function useAutoPlayerBets(
    phase: string | null,
    wheelRef: React.RefObject<WheelRef>,
    animateCoin: (amount: number, color: string, target: HTMLElement, startX?: number, startY?: number) => void,
    playersBettingStatus: 'on' | 'off',
    playerRef: React.RefObject<HTMLButtonElement | null>
) {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        // Clean up when not in betting phase
        if (phase !== 'bettingTimer') {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            startTimeRef.current = null;
            return;
        }

        // Don't run if status is off
        if (playersBettingStatus !== 'on') {
            return;
        }

        // Don't run if player ref not available
        if (!playerRef.current) {
            return;
        }

        // Only start once per phase
        if (startTimeRef.current !== null) {
            return;
        }

        // Record the exact start time
        startTimeRef.current = Date.now();
        const DURATION = 3000; // 3 seconds

        // Function to drop a coin
        const dropCoin = () => {
            const elapsed = Date.now() - startTimeRef.current!;
            
            // Stop if more than 3 seconds have passed
            if (elapsed >= DURATION) {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
                return;
            }

            if (!playerRef.current) return;

            // Pick random cabin (1-8)
            const randomCabinIndex = Math.floor(Math.random() * 8) + 1;
            const cabinEl = wheelRef.current?.getCabinElement(randomCabinIndex);
            
            if (!cabinEl) return;

            // Get player icon position (top-left)
            const rect = playerRef.current.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            // Random amount and color
            const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
            const color = COLORS[Math.floor(Math.random() * COLORS.length)];

            // Animate coin from player icon to cabin
            animateCoin(amount, color, cabinEl, startX, startY);
        };

        // Start dropping coins every 400ms
        intervalRef.current = setInterval(dropCoin, 400);

        // Failsafe: Force stop after 3 seconds
        timeoutRef.current = setTimeout(() => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }, DURATION);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [phase, animateCoin, wheelRef, playersBettingStatus, playerRef]);
}