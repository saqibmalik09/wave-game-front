'use client';

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { RootState } from "@/lib/redux/store";
import { gameInitialization } from "../gameInitialization";

import TopBar from "./components/TopBar";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import BottomBar from "./components/BottomBar";
import Wheel, { WheelRef } from "./components/Wheel";
import { useCoinAnimations } from "./components/useCoinAnimations";
import { CoinAnimation } from "./components/CoinAnimation";
import MessageModal from "@/app/components/messageModel";
import GameLoading from "@/app/components/GameLoading";
import { useAutoPlayerBets } from "./components/useAutoPlayerBets";
import ResultModal from "./components/ResultModal";
import { useUserInfo } from "../UserInfoAPI";
import { useRealtimeNetwork } from "@/app/components/useNetworkStatus";
import NetworkStatus from "@/app/components/NetworkStatus";

export default function GreedyGameUI() {
  const dispatch = useDispatch();
  const tenant = useSelector((s: RootState) => s.tenantDetails.data);
  const user = useSelector((s: RootState) => s.userPlayerData?.data);
  const [ready, setReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  const [isValid, setIsValid] = useState(true);
  const netState = useRealtimeNetwork(5000);
  const { animations, animateCoin, removeAnimation, clearAllAnimations } = useCoinAnimations();
  const wheelRef = useRef<WheelRef>({ getCabinElement: () => null });
  const playerRef = useRef<HTMLButtonElement>(null);

  const phase = useSelector((s: RootState) => s.teenpattiTimer.phase);
  const playersBettingStatus: 'on' | 'off' = 'on';
  const { loadUser } = useUserInfo();


  // Hook to auto-drop coins for first 5 seconds of betting
  useAutoPlayerBets(phase, wheelRef, animateCoin, playersBettingStatus, playerRef);

  useEffect(() => {
    if (phase === 'newGameStartTimer') {
      clearAllAnimations();
    }
    if( phase === 'bettingTimer'|| phase ==='resultAnnounceTimer') {
      // get user info
     const params = new URLSearchParams(window.location.search);
     const token = params.get("token");
     if (!token) {
       console.error("Missing token in URL params");
       return;
     }
       loadUser(token).catch(console.error);
    }
  }, [phase, clearAllAnimations]);

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

      const response = await gameInitialization({ dispatch, tenant, user, appKey, token, gameId });
      if (!response.success) {
        setModalMessage({ title: "Invalid Parameters", message: "Missing appKey, token, or gameId." });
        setShowModal(true);
        setIsValid(false);
        return;
      }
      setReady(true);
    };
    runInit();
  }, []);
  

  if (!ready && isValid) return <GameLoading message="Initializing game..." />;

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sky-300 to-blue-600 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-60 
          [background-image:radial-gradient(2px_2px_at_20px_30px,white,transparent),
          radial-gradient(2px_2px_at_40px_70px,rgba(255,255,255,0.8),transparent),
          radial-gradient(2px_2px_at_50px_160px,white,transparent)]">
        </div>
          <NetworkStatus state={netState} />
        

        <div className="relative w-full max-w-lg h-screen flex items-center justify-center"
        // background image
        style={{ backgroundImage: 'url("/greedyBackgroundImage.jpeg")', backgroundSize: 'contain' }}
        >
          <div className="relative w-full h-full isolate">
            <TopBar playerRef={playerRef} />
            <LeftPanel />
            <RightPanel />

            <div className="absolute inset-0 z-10 flex items-center justify-center px-[70px] pt-[35px] pb-[120px]">
              <Wheel ref={wheelRef} animateCoin={animateCoin} />
            </div>

            <BottomBar />
          </div>
        </div>

        {animations.map(anim => (
          <CoinAnimation
            key={anim.id}
            {...anim}
            onComplete={() => removeAnimation(anim.id)}
            stayDuration={15000}
          />
        ))}
      </div>
    <span className="z-9999"><ResultModal  /></span>
      <MessageModal
        show={showModal}
        header={modalMessage.title}
        message={modalMessage.message}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}