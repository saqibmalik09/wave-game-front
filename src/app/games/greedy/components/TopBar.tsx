// TopBar.tsx
import { useRef, useState } from 'react';
import PlayerTopBar from './PlayerTopBar';
import { useCurrentRoundID } from '@/lib/socket/game/greedy/greedySocketEventHandler';

interface TopBarProps {
    playerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function TopBar({ playerRef }: TopBarProps) {
  
    const [roundCount, setRoundCount] = useState('Loading...');

    useCurrentRoundID((payload) => {
      setRoundCount(payload.data.count);
    });
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex justify-between items-start px-1 pt-2">
      <div className="flex items-center gap-1">
        <button className="w-9 h-9 bg-orange-400 rounded-full flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Player Icon */}
        <PlayerTopBar ref={playerRef} />
      </div>

      <div className="flex flex-col items-end gap-1 mt-14">
        <div className="bg-blue-500 text-white text-[11px] px-3 py-1 rounded-lg font-bold shadow">
          Round {roundCount}
        </div>
        <button className="bg-orange-400 text-white text-[11px] px-1 py-0.5 rounded-lg font-bold shadow">
          🕐 Record
        </button>
      </div>
    </header>
  );
}