// GreedyGame.tsx file

'use client';

import BetCategory from "./components/BetCategory";
import BottomBar from "./components/BottomBar";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import TopBar from "./components/TopBar";
import Wheel from "./components/Wheel";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { RootState } from "@/lib/redux/store";
import { gameInitialization } from "../gameInitialization";


export default function GreedyGameUI() {
  const dispatch = useDispatch();
  const tenant = useSelector((s: RootState) => s.tenantDetails.data);
  const user = useSelector((s: RootState) => s.userPlayerData?.data);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const runInit = async () => {
      const params = new URLSearchParams(window.location.search);
      const appKey = params.get("appKey");
      const token = params.get("token");
      const gameId = params.get("gameId");
      if (!appKey || !token || !gameId) {
        console.error("Missing URL params");
        return;
      }

      const response = await gameInitialization({
        dispatch,
        tenant,
        user,
        appKey,
        token,
        gameId,
      });

      if (!response.success) {
        console.error(response.error);
        return;
      }

      setReady(true);
    };

    runInit();
  }, []);
  const handleHelpClick = () => {
    console.log("Help button clicked");
  }
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
        <div className="relative w-full h-full isolate">
          <TopBar />
          <LeftPanel />
          <RightPanel />

          <div className="absolute inset-0 z-10 flex items-center justify-center
                 px-[70px] pt-[35px] pb-[120px]">
            <Wheel />
          </div>

          <BetCategory />
          <BottomBar />

          <button
            onClick={handleHelpClick}
            className="absolute top-4 right-4 z-40 px-3 py-1
      bg-red-500 bg-opacity-30 backdrop-blur-md rounded-lg
      text-sm font-medium text-white hover:bg-opacity-50 transition"
          >
            Help
          </button>
        </div>

      </div>
    </div>
  );
}