import { useEffect, useRef, useState } from "react";
import { SoundManager } from "../../teenpatti/game/SoundManager";

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
  const currentIndexRef = useRef(1);
  const isSpinningRef = useRef(false);
  const isStoppingRef = useRef(false);

  const clearSpinInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 🔄 Start spinning
  const startSpin = (speed: number) => {
    clearSpinInterval();
    SoundManager.getInstance().play('GreedyWheelSpinSound');
    intervalRef.current = setInterval(() => {
      setSpinState({
        currentHighlight: currentIndexRef.current,
        isWinnerHighlighted: false,
      });

      currentIndexRef.current =
        currentIndexRef.current >= 8 ? 1 : currentIndexRef.current + 1;
    }, speed);
  };

  //  Stop exactly at winner
  const stopAtWinner = (winner: number) => {
    clearSpinInterval();

    intervalRef.current = setInterval(() => {
      setSpinState({
        currentHighlight: currentIndexRef.current,
        isWinnerHighlighted: false,
      });

      if (currentIndexRef.current === winner) {
        clearSpinInterval();

        setSpinState({
          currentHighlight: winner,
          isWinnerHighlighted: true,
        });

        isStoppingRef.current = false;
        isSpinningRef.current = false;
        return;
      }

      currentIndexRef.current =
        currentIndexRef.current >= 8 ? 1 : currentIndexRef.current + 1;
    }, 120);
  };

  useEffect(() => {

    if (phase === "winningCalculationTimer" && !isSpinningRef.current) {
      isSpinningRef.current = true;
      isStoppingRef.current = false;
      startSpin(100);
    }

    // 🏁 Result phase → slow down & stop
    if (
      phase === "resultAnnounceTimer" &&
      winningIndex !== null &&
      !isStoppingRef.current
    ) {
      isStoppingRef.current = true;
      stopAtWinner(winningIndex);
    }

    // 🔁 Full reset when round ends
    if (phase === null) {
      clearSpinInterval();

      isSpinningRef.current = false;
      isStoppingRef.current = false;
      currentIndexRef.current = 1;

      setSpinState({
        currentHighlight: null,
        isWinnerHighlighted: false,
      });
    }
  }, [phase, winningIndex]);

  return spinState;
};
