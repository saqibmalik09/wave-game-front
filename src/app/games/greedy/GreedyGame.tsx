// GreedyGame.tsx file

'use client';

import BetCategory from "./components/BetCategory";
import BottomBar from "./components/BottomBar";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import TopBar from "./components/TopBar";
import Wheel from "./components/Wheel";

export default function GreedyGame() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-300 to-blue-600 overflow-hidden">
      
      {/* Stars overlay - full screen */}
      <div className="absolute inset-0 pointer-events-none opacity-60 
        [background-image:radial-gradient(2px_2px_at_20px_30px,white,transparent), 
        radial-gradient(2px_2px_at_40px_70px,rgba(255,255,255,0.8),transparent), 
        radial-gradient(2px_2px_at_50px_160px,white,transparent)]">
      </div>

      {/* Centered container with fixed max width */}
      <div className="relative w-full max-w-lg h-screen flex items-center justify-center">
        
        {/* Game content wrapper */}
        <div className="relative w-full h-full">
          
          <TopBar />
          <LeftPanel />
          <RightPanel />

          <div className="absolute inset-0 flex items-center justify-center 
            px-[70px] pt-[35px] pb-[120px]">
            <Wheel />
          </div>

          <BetCategory />
          <BottomBar />

        </div>
      </div>
    </div>
  );
}