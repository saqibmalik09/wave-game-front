// TopBar.tsx
import { useRef, useState } from 'react';
import PlayerTopBar from './PlayerTopBar';
import { useCurrentRoundID } from '@/lib/socket/game/greedy/greedySocketEventHandler';
import { useRouter } from 'next/navigation'
import { SoundManager } from '../../teenpatti/game/SoundManager';
interface TopBarProps {
  playerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function TopBar({ playerRef }: TopBarProps) {
  const router = useRouter();
  const [roundCount, setRoundCount] = useState('Loading...');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useCurrentRoundID((payload) => {
    setRoundCount(payload.data.count);
  });
  const handleBackButton = () => {
    const params = new URLSearchParams(window.location.search);
    const appKey = params.get("appKey");
    const token = params.get("token");
    if (!appKey || !token) {
      console.error("Missing URL params");
      return;
    }
    router.push(`/games?appKey=${appKey}&token=${token}`);
  };
    const toggleSound = () => {
      const soundManager = SoundManager.getInstance();
      const newState = soundManager.toggle();
      setSoundEnabled(newState);
  
      // Optional: Play a test sound when enabling
      if (newState) {
        soundManager.play('GreedySoundButtonToggle', 0.5);
        const sound = SoundManager.getInstance();
         sound.playBackground('GreedyBackgroundMusic', 0.03); 
      }
    };
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex justify-between items-start px-1 pt-2">
      <div className="flex items-center gap-1">
        {/* BACK button */}
        <button onClick={handleBackButton} className="w-9 h-9 bg-orange-400 rounded-full flex items-center justify-center shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
                    <button
              className="btn border-none p-0 d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: '#FF7201',
                width: 'clamp(38px, 5vw, 25px)',
                height: 'clamp(38px, 5vw, 25px)',
                minWidth: '20px',
                transition: 'all 0.2s ease',
              }}
              onClick={toggleSound}
            >
              {soundEnabled ? (
                <svg
                  width="clamp(18px, 2vw, 16px)"
                  height="clamp(18px, 2vw, 16px)"
                  viewBox="0 0 24 24"
                  fill="rgb(255, 255, 255)"
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{
                    width: 'clamp(24px, 2vw, 16px)',
                    height: 'clamp(24px, 2vw, 16px)',
                  }}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg
                  width="clamp(18px, 2vw, 16px)"
                  height="clamp(18px, 2vw, 16px)"
                  viewBox="0 0 24 24"
                  fill="#ffffff"
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{
                    width: 'clamp(24px, 2vw, 16px)',
                    height: 'clamp(24px, 2vw, 16px)',
                  }}
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              )}
            </button>

        {/* Player Icon */}
        <PlayerTopBar ref={playerRef} />
      </div>

      <div className="flex flex-col items-end gap-1 mt-auto">
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