// useCabinSpinEffect.ts
import { useEffect, useState, useRef } from 'react';

interface SpinState {
  currentHighlight: number | null;
  isWinnerHighlighted: boolean;
}

export const useCabinSpinEffect = (
  phase: string | null,
  winningIndex: number | null
) => {
  const [spinState, setSpinState] = useState<SpinState>({
    currentHighlight: null,
    isWinnerHighlighted: false,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef(1);
  const isStoppingRef = useRef(false);

  useEffect(() => {
    // Clear existing timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reset when not in relevant phases
    if (phase !== 'winningCalculationTimer' && phase !== 'resultAnnounceTimer') {
      setSpinState({ currentHighlight: null, isWinnerHighlighted: false });
      isStoppingRef.current = false;
      currentIndexRef.current = 1;
      return;
    }

    // Start spinning during calculation phase
    if (phase === 'winningCalculationTimer') {
      console.log(' Starting cabin spin...');
      isStoppingRef.current = false;
      currentIndexRef.current = 1;

      intervalRef.current = setInterval(() => {
        setSpinState(prev => ({
          ...prev,
          currentHighlight: currentIndexRef.current,
          isWinnerHighlighted: false,
        }));
        
        currentIndexRef.current = currentIndexRef.current >= 8 ? 1 : currentIndexRef.current + 1;
      }, 100); // Spin every 100ms
    }

    // Smoothly stop at winner when result phase starts
    if (phase === 'resultAnnounceTimer' && !isStoppingRef.current && winningIndex) {
      console.log(`🎯 Result phase - smoothly stopping at cabin ${winningIndex}...`);
      isStoppingRef.current = true;

      // Clear fast spinning
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      // Continue spinning but slow down and stop at winner
      const slowSpinInterval = setInterval(() => {
        setSpinState(prev => ({
          ...prev,
          currentHighlight: currentIndexRef.current,
          isWinnerHighlighted: false,
        }));

        // If we're at the winning index, stop here
        if (currentIndexRef.current === winningIndex) {
          clearInterval(slowSpinInterval);
          
          // Show winner with green border
          console.log(`Stopped at winning cabin: ${winningIndex}`);
          setSpinState({
            currentHighlight: winningIndex,
            isWinnerHighlighted: true,
          });
          return;
        }

        // Move to next cabin
        currentIndexRef.current = currentIndexRef.current >= 8 ? 1 : currentIndexRef.current + 1;
      }, 50); // Slower spin (150ms) for smooth stop
    }

    // Keep winner highlighted during entire result phase
    if (phase === 'resultAnnounceTimer' && spinState.isWinnerHighlighted) {
      // Winner stays highlighted - do nothing, just keep it
      console.log('🟢 Keeping winner highlighted during result phase');
    }

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
  }, [phase, winningIndex, spinState.isWinnerHighlighted]);

  return spinState;
};