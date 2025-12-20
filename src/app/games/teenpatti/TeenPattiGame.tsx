//TeenPattiGame.tsx
'use client';
import { TeenPattiEngine } from './game/TeenPattiEngine';
import { SoundManager } from './game/SoundManager';
import ApiService from '@/lib/api/api';
import { getCache, setCache } from '@/lib/cache';
import { useAppSelector } from '@/lib/redux/hooks';
import React, { useEffect, useRef, useState } from 'react';
import TopBar from './components/TopBar';
import PlayersList from './components/PlayersList';
import CoinTray from './components/CoinTray';
import PotCard from './components/PotCard';
import ResultModal from './components/ResultModal';
import MessageModal from '@/app/components/messageModel';
import Timer from './components/Timer';
import { useToast } from './components/Toast';
import { gameConfiguration as fetchGameConfiguration, tanantDetailsByAppKey } from '@/lib/socket/socketEventHandlers';
import { placeTeenpattiBet, teenpattiGameTableJoin, useTeenpattiBetResponseListener } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';
import { useDispatch, useSelector } from "react-redux";
import { setGameConfiguration } from '@/lib/redux/slices/teenpatti/gameConfiguration';
import { setTenantDetails } from '@/lib/redux/slices/tenantDetails';
import { setUserPlayerInfo } from '@/lib/redux/slices/userSlice';
import { setPendingCoin } from '@/lib/redux/slices/teenpatti/coinDropAnimation';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '@/lib/redux/store';
import GameLoading from "@/app/components/GameLoading";

interface TenantData {
  success: boolean;
  message: string;
  data: {
    activeGames: string;
    tanantName: string;
    tenantAppKey: string;
    tenantProductionDomain: string;
    tenantTestingDomain: string;
    tenantPassword: string;
  };
}
interface UserInfoType {
  appKey: string;
  token: string;
  gameId: string;
}

interface UserData {
  id: string;
  name: string;
  balance: number;
  profilePicture: string;
}
interface GameUserInfoResponse {
  success: boolean;
  message: string;
  data: UserData;
}
interface GameConfig {
  colors: string[];
  gameId: number;
  cardImages: string[][];
  BettingTime: number;
  nextBetWait: number;
  bettingCoins: number[];
  dealerAvatar: string;
  timerUpSound: string;
  cardBackImages: string[][];
  cardsShuffleSound: string;
  tableBackgroundImage: string;
  winningCalculationTime: number;
  betButtonAndCardClickSound: string;
  returnWinngingPotPercentage: number[];
}
const phaseLabels: Record<string, string> = {
  bettingTimer: 'Start Betting',
  winningCalculationTimer: 'Calculating',
  resultAnnounceTimer: '',
  newGameStartTimer: 'Wait',
};
export default function TeenPattiGame() {
  const dispatch = useDispatch();
  const { ToastContainer, showToast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<TeenPattiEngine | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig>();
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const latestBet = useAppSelector((s) => s.teenPattiBettingReducer.lastBet);
  const winningPotIndex = useSelector((s: RootState) => s.winningPot.winningPotIndex);
  const currentPhase = useSelector((s: RootState) => s.teenpattiTimer.phase);
  const tenant = useSelector((state: RootState) => state.tenantDetails.data);
  const [showModal, setShowModal] = useState(false);
  const [playerData, setPlayerData] = useState<UserData | null>(null);
  // const [tenantData, setTenantData] = useState<TenantData>();
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  const user = useSelector((state: RootState) => state.userPlayerData);
  const gameId = React.useMemo(() => ({ gameId: 16 }), []);
  const idNumber = gameId.gameId;
  const cacheKey = `game_config_${idNumber}`;
  // ------------------------
  // REUSABLE FUNCTION
  // ------------------------
  const fetchUserInfo = async () => {
    try {
      if (!tenant) {
        //model error 
        setModalMessage({
          title: "Missing information",
          message: "Invalid or missing userInfo or tenant data",
        });
        setShowModal(true);
        return;
      };
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      if (!token) {
        setModalMessage({
          title: "Missing information",
          message: "Token is missing in URL parameters",
        });
        setShowModal(true);
        return;
      }
      const tenantDomainURL = tenant.tenantProductionDomain;
      const response: GameUserInfoResponse = await ApiService.gameUserInfo({
        token: token,
        tenantDomainURL,
      });
      if (response.success) {
        setPlayerData(response.data);
        dispatch(setUserPlayerInfo({
          success: response.success,
          message: response.message,
          data: response.data,
        }));
        return;
      }
      setModalMessage({
        title: "Missing information",
        message: "Invalid or missing userInfo",
      });
      setShowModal(true);

    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const appKey = params.get("appKey");
    const token = params.get("token");
    const gameId = params.get("gameId");
    if (!appKey || !token || !gameId) {
      setModalMessage({
        title: "Invalid Params",
        message: "appKey, token, and gameId are required",
      });
      setShowModal(true);
      return;
    }
    const userInfo = {
      appKey,
      token,
      gameId
    }
    setUserInfo(userInfo);
    const cached = getCache(cacheKey);
    if (cached) {
      setGameConfig(cached);
      dispatch(setGameConfiguration(cached));
      SoundManager.getInstance().loadSounds({
        timerUpSound: `${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${cached.timerUpSound}`,
        potClickSound: `${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${cached.potClickSound}`,
        cardsShuffleSound: `${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${cached.cardsShuffleSound}`,
        betButtonAndCardClickSound: `${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${cached.betButtonAndCardClickSound}`,
      });
      return;
    }
    fetchGameConfiguration(gameId, (data: any) => {
      if (data) {
        setGameConfig(data);
        setCache(cacheKey, data);
        dispatch(setGameConfiguration(data));
        SoundManager.getInstance().loadSounds({
          timerUpSound: `${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${data.timerUpSound}`,
          cardsShuffleSound: `${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${data.cardsShuffleSound}`,
          betButtonAndCardClickSound: `${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${data.betButtonAndCardClickSound}`,
        });
      }
    });
    fetchUserInfo();
  }, [gameId]);

  useEffect(() => {
    if (
      currentPhase === "resultAnnounceTimer" ||
      currentPhase === "newGameStartTimer"
    ) {
      fetchUserInfo(); // <-- call here
    }
  }, [currentPhase]);

  useTeenpattiBetResponseListener((data) => {
    if (data.success) {
      // showToast(data.message ?? `Bet placed: ₹${data.amount}`, "success");
      dispatch(setPendingCoin({ potIndex: Number(data.data.potIndex), value: data.data.amount }));
      dispatch(setUserPlayerInfo({
        success: data.success,
        message: data.message,
        data: data.data,
      }));
    } else {
      showToast(data.message ?? "Bet failed!", "error");
    }
  });

  useEffect(() => {
    if (!latestBet || !userInfo || !tenant) return;
    const cachedApplicationInfo = getCache("applicationInfo") || {};
    const socketId = cachedApplicationInfo.socketId || "";
    const connectionUserId = playerData ? playerData.id : user.data?.id;
    if (!connectionUserId) {
      console.log("User ID is missing, cannot place bet.");
      return;
    }
    let tenantBaseURL;
    if (tenant.environemnt === "production") {
      tenantBaseURL = tenant.tenantProductionDomain;
    } else {
      tenantBaseURL = tenant.tenantTestingDomain;
    }
    if (!tenantBaseURL) {
      MessageModal({
        show: true,
        header: "Tenant URL Missing",
        message: "Cannot place bet without tenant base URL.",
        onClose: () => { },
      });
      setShowModal(true);
      return;
    }
    const betData = {
      userId: connectionUserId.toString(),
      amount: latestBet.amount,
      tableId: latestBet.tableId,
      betType: latestBet.betType,
      potIndex: String(latestBet.potIndex), // cast to string
      socketId: String(socketId),
      appKey: userInfo.appKey!,
      token: userInfo.token!,
      gameId: userInfo.gameId!,
      tenantBaseURL: tenantBaseURL || "",
    };
    placeTeenpattiBet(betData);
  }, [latestBet]);


  // const onCardClick = () => SoundManager.getInstance().play('betButtonAndCardClickSound');
  // const onShuffleCards = () => SoundManager.getInstance().play('cardsShuffleSound');

  // Initialize PixiJS engine AFTER canvas and config are ready
  useEffect(() => {
    if (!canvasRef.current || !gameConfig) return;
    if (engine) return;

    const initEngine = () => {
      if (!canvasRef.current) return;
      const pixiEngine = new TeenPattiEngine(canvasRef.current, 1280, 720);

      pixiEngine.loadAssets(gameConfig)
        .then(() => {
          pixiEngine.createPots(gameConfig);
          setEngine(pixiEngine);
          setConfigLoaded(true);
        })
        .catch((err) => {
          // console.error('[TeenPatti] Failed to load assets:', err)
        });

      return () => {
        pixiEngine.destroy();
        setEngine(null);
        setConfigLoaded(false);
      };
    };

    const rafId = requestAnimationFrame(initEngine);
    return () => cancelAnimationFrame(rafId);
  }, [canvasRef, gameConfig]);

  useEffect(() => {
    if (engine && configLoaded) {
      engine.flipAllCards();
    }
  }, [engine, configLoaded]);

  const pots = gameConfig?.cardImages.map((cards: string[], idx: number) => ({
    potIndex: idx,
    potName: `Pot ${String.fromCharCode(65 + idx)}`,
    totalBet: 1000 * (idx + 1),
    betCoins: gameConfig.bettingCoins,
    cardImages: cards,
    cardBackImages: gameConfig.cardBackImages[idx],
    isWinner: idx === winningPotIndex,
    // multiplier: gameConfig.returnWinngingPotPercentage[idx] || 1,
    // showFront: true,
    // onPotClick: () => { },
  })) || [];

  if (!gameConfig) {
    return (
      <div>
        <GameLoading message="Hold on" />
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full min-h-screen max-w-md mx-auto overflow-hidden" >

        {/* Top Bar - Fixed at top */}
        <div className="absolute top-0 left-0 w-full z-50">
          <TopBar />
        </div>

        {/* Left Players List - Absolute positioned */}
        <div className="absolute left-2 top-[15%] z-40">
          <PlayersList />
        </div>

        {/* Pots Container - Positioned at 68% from top */}
        <div className="absolute top-[71%] left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 flex gap-2 px-3">
          {pots.map((pot) => (
            <React.Fragment key={pot.potIndex}>

              {/* Timer above POT 0 */}
              {pot.potIndex === 0 && (
                <span className="absolute -top-9 left-[16%] -translate-x-1/2 z-40">
                  <Timer />
                </span>
              )}

              {/* Yellow Label above POT 1 */}
              {pot.potIndex === 1 && currentPhase && phaseLabels[currentPhase] && (
                <span className="absolute -top-7 left-[50%] -translate-x-1/2 z-40 pointer-events-none">
                  <span
                    className="relative flex items-center justify-center select-none"
                    style={{
                      minWidth: "clamp(40px, 14vw, 30px)",
                      height: "clamp(15px, 4vw, 12px)",
                      padding: "0 4px",
                      borderRadius: "10px",
                      background: "linear-gradient(180deg, #f4d27a 0%, #e9b94f 100%)",
                      boxShadow:
                        "0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
                      color: "#3b2400",
                      fontSize: "clamp(8px, 0.5vw, 7px)",
                      fontWeight: 600,
                      letterSpacing: "0.4px",
                      textTransform: "uppercase",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#3b2400",
                        opacity: 0.6,
                        marginRight: 6,
                      }}
                    />
                    {phaseLabels[currentPhase]}
                  </span>
                </span>
              )}

              <PotCard {...pot} />
            </React.Fragment>
          ))}
        </div>

        {/* Coin Tray - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 w-full z-40">
          <CoinTray key={gameConfig?.gameId ?? "default"} />
        </div>

        {/* Modals */}
        <MessageModal
          show={showModal}
          header={modalMessage.title}
          message={modalMessage.message}
          onClose={() => setShowModal(false)}
        />
        <ResultModal />
        <ToastContainer />
      </div>

    </>
    // <div className="w-xs min-h-full flex items-center justify-center text-white  ">

    //   <div className="w-full min-w-2xs min-h-screen max-w-xl relative overflow-hidden">

    //     {/* TOP BAR */}
    // <div className="absolute w-full">
    //   <TopBar />
    // </div>

    //     {/* PLAYER LIST + TIMER ROW */}
    //     <div className="  left-0 w-full flex z-40">

    //       {/* LEFT PLAYER LIST */}
    // <div className=" absolute flex-shrink-0 top-[10%]">
    //   <PlayersList />
    // </div>
    //       {/*  in center responsive dealer avatar image png  `${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${gameConfig?.dealerAvatar} make sure */}

    //         <div className="absolute flex justify-center top-[20%] left-[15%]">
    //           <div
    //             className="relative select-none"
    //             style={{
    //               width: 'clamp(80px, 18vw, 180px)',
    //               height: 'clamp(80px, 18vw, 180px)',
    //                background: 'transparent',
    //             }}
    //             draggable={false}
    //           >
    //             <img
    //               src={`${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${gameConfig?.dealerAvatar}`}
    //               alt="Dealer Avatar"
    //               style={{
    //                 width: '100%',
    //                 height: '100%',
    //                 objectFit: 'contain',
    //                 background: 'transparent',
    //                 display: 'block',
    //               }}
    //             />
    //           </div>
    //         </div>

    //     </div>

    //     {/* GAME CANVAS BACKGROUND */}
    //     <div
    //       ref={canvasRef}
    //       className="absolute inset-0 z-10 shadow-lg"
    //       style={{
    //         width: "100%",
    //         height: "100%",
    //         borderRadius: "14px",
    //         overflow: "hidden",
    //       }}></div>

    //     {/* POTS (center) */}
    //     <div className="absolute top-[68%] left-1/2 z-30 -translate-x-1/2 -translate-y-1/2 flex gap-2 px-3">
    //       {pots.map((pot) => (
    //         <React.Fragment key={pot.potIndex}>
    //           {/* === TIMER ABOVE POT 0 === */}
    //           {pot.potIndex === 0 && (
    // <span className="absolute -top-13 left-1/6 -translate-x-1/2 z-40">
    //   <Timer />
    // </span>
    //           )}

    //           {/* === YELLOW LABEL ABOVE POT 1 === */}
    //           {pot.potIndex === 1 && currentPhase && phaseLabels[currentPhase] && (
    //             <span className="absolute -top-10 left-2/4 -translate-x-1/2 z-40 pointer-events-none">
    //               <span
    //                 className="relative flex items-center justify-center select-none"
    //                 style={{
    //                   minWidth: "clamp(70px, 25vw, 110px)",
    //                   height: "clamp(22px, 7vw, 28px)",
    //                   padding: "0 10px",
    //                   borderRadius: "14px",
    //                   background: "linear-gradient(180deg, #f4d27a 0%, #e9b94f 100%)",
    //                   boxShadow:
    //                     "0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
    //                   color: "#3b2400",
    //                   fontSize: "clamp(10px, 1.8vw, 12px)",
    //                   fontWeight: 600,
    //                   letterSpacing: "0.4px",
    //                   textTransform: "uppercase",
    //                 }}
    //               >
    //                 <span
    //                   style={{
    //                     width: 6,
    //                     height: 6,
    //                     borderRadius: "50%",
    //                     background: "#3b2400",
    //                     opacity: 0.6,
    //                     marginRight: 6,
    //                   }}
    //                 />
    //                 {phaseLabels[currentPhase]}
    //               </span>
    //             </span>
    //           )}
    //           <PotCard {...pot} />
    //         </React.Fragment>
    //       ))}
    //     </div>




    //     {/* COIN TRAY (bottom) */}
    // <div className="absolute bottom-0 left-0 w-full z-40">
    //   <CoinTray key={gameConfig?.gameId ?? "default"} />
    // </div>

    //     {/* MODALS */}
    //     <MessageModal
    //       show={showModal}
    //       header={modalMessage.title}
    //       message={modalMessage.message}
    //       onClose={() => setShowModal(false)}
    //     />
    //     <ResultModal />
    //     <ToastContainer />

    //   </div>
    // </div>
  );

}