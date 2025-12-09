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
import { gameConfiguration as fetchGameConfiguration } from '@/lib/socket/socketEventHandlers';
import {  placeTeenpattiBet, teenpattiGameTableJoin, useTeenpattiBetResponseListener } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';
import { useDispatch, useSelector } from "react-redux";
import { setGameConfiguration } from '@/lib/redux/slices/teenpatti/gameConfiguration';
import { setTenantDetails } from '@/lib/redux/slices/tenantDetails';
import {  setUserPlayerInfo } from '@/lib/redux/slices/userSlice';
import { setPendingCoin } from '@/lib/redux/slices/teenpatti/coinDropAnimation';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '@/lib/redux/store';

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

export default function TeenPattiGame() {
  const dispatch = useDispatch();
  const { ToastContainer, showToast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<TeenPattiEngine | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig>();
  const [userInfo, setUserInfo] = useState<UserInfoType>();
  const latestBet = useAppSelector((s) => s.teenPattiBettingReducer.lastBet);
  const winningPotIndex = useSelector((s:RootState) => s.winningPot.winningPotIndex);
  const currentPhase = useSelector((s:RootState) => s.teenpattiTimer.phase);

  const [showModal, setShowModal] = useState(false);
  const [playerData, setPlayerData] = useState<UserData | null>(null);
  const [tenantData, setTenantData] = useState<TenantData>();
  const [modalMessage, setModalMessage] = useState({ title: "", message: ""});
  const user = useSelector((state: RootState) => state.userPlayerData);
  console.log("User from Redux:", user);
  const gameId = React.useMemo(() => ({ gameId: 16 }), []);
  const idNumber = gameId.gameId;
  const cacheKey = `game_config_${idNumber}`;
// ------------------------
// REUSABLE FUNCTION
// ------------------------
const fetchUserInfo = async () => {
  try {
    console.log("Fetching user info with tenantData and userInfo:", tenantData, userInfo);
    if (!userInfo || !tenantData) return;
    const tenantDomainURL = tenantData.data.tenantProductionDomain;
    // let connectionUserId = user.data? user.data.id:null;
  //  connectionUserId playerData.id? connectionUserId=playerData.id:null;
    //check if playerData has user id else get from user.data.id and pass to connectionUserId
    let connectionUserId=null;
    if(playerData){
      console.log("getting form playerdata")
      connectionUserId=playerData.id;
    }else{
    console.log("getting form connectionUserId2")
      connectionUserId=user.data?.id;
    }


    if (!connectionUserId) {
      console.warn("User ID not available yet.");
    //reload window to restart
      window.location.reload();
      return;
      }
    const response: GameUserInfoResponse = await ApiService.gameUserInfo({
      token: userInfo.token,
      tenantDomainURL,
    });
    console.log("Fetched NewJoiner:", response);

    if (response.success) {
      setPlayerData(response.data);
      dispatch(setUserPlayerInfo({
        success: response.success,
        message: response.message,
        data: response.data,
      }));

      const NewJoiner = {
        userId: connectionUserId,
        name: response.data.name,
        imageProfile: response.data.profilePicture,
        appKey:userInfo.appKey,
        token:userInfo.token
      };
      console.log("New Joiner Data:", NewJoiner);
         teenpattiGameTableJoin(NewJoiner);
      // let socketDetails={
      //   userId:connectionUserId,
      //   socketId:socketId
      // }    
    
      // mySocketIdEvent(socketDetails)
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
    // const USERID_KEY = 'userId';
    // let userId=getCache(USERID_KEY)
    // if(!userId){
    // userId = uuidv4();
    // }
    // setCache(USERID_KEY, userId);
    // const userId=user.data?.id;

    const cached = getCache(cacheKey);
    if (cached) {
      setGameConfig(cached);
      dispatch(setGameConfiguration(cached));
      SoundManager.getInstance().loadSounds({
        timerUpSound:`${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${cached.timerUpSound}` ,
        cardsShuffleSound:`${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${cached.cardsShuffleSound}` ,
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
          timerUpSound:`${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${data.timerUpSound}` ,
          cardsShuffleSound:`${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${data.cardsShuffleSound}` ,
          betButtonAndCardClickSound:`${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${data.betButtonAndCardClickSound}` ,
        });
      }
    });
  }, [gameId]);

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
    if (!appKey) {
      setModalMessage({
        title: "Invalid Params",
        message: "app Key Is required",
      });
      setShowModal(true);
      return;
    }
    if (!token) {
      setModalMessage({
        title: "Invalid Params",
        message: "token Is required",
      });
      setShowModal(true);
      return;
    }
    if (!gameId) {
      setModalMessage({
        title: "Invalid Params",
        message: "Game ID Is required",
      });
      setShowModal(true);
      return;
    }
    // tanantDetailsByAppKey(appKey, (data) => {
    //   if (data.success) {
    //     setTenantData(data)
    //     dispatch(setTenantDetails(data))
    //   } else {
    //     setModalMessage({
    //       title: "Wrong App Key provided",
    //       message: "Invalid AppKey OR invalid data",
    //     });
    //     setShowModal(true);
    //     return;
    //   }
    // });
    setUserInfo(userInfo);
  }, []);

  useEffect(() => {
    if (!tenantData || !userInfo) return; // wait until both are ready

    if (tenantData.success) {
      fetchUserInfo();
    } else {
      console.warn("Tenant data invalid or unsuccessful:", tenantData);
    }
  }, [tenantData, userInfo]);

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
      // console.log("Teenpatti Bet Response Data:", data);
      // showToast(data.message ?? `Bet placed: ₹${data.amount}`, "success");
      dispatch(setUserPlayerInfo({
      success: data.success,
      message: data.message,
      data: data.data,
      }));
      dispatch(setPendingCoin({ potIndex: Number(data.data.potIndex), value:data.data.amount }));
    } else {
      showToast(data.message ?? "Bet failed!", "error");
    }
  });

 useEffect(() => {
  if (!latestBet || !userInfo) return;
  const cachedApplicationInfo = getCache("applicationInfo") || {};
  const socketId = cachedApplicationInfo.socketId || "";
  const connectionUserId = playerData ? playerData.id : user.data?.id;
  if (!connectionUserId) {
   alert("User ID not available for placing bet.");
    return;
  }
  const betData = {
    userId: connectionUserId,
    amount: latestBet.amount,
    tableId: latestBet.tableId,
    betType: latestBet.betType,
    potIndex: String(latestBet.potIndex), // cast to string
    socketId: String(socketId),
    appKey: userInfo.appKey!, // non-null assertion
    token: userInfo.token!,
    gameId: userInfo.gameId!,
  };

  placeTeenpattiBet(betData);
}, [latestBet, userInfo]);


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
      potName: `Pot ${idx + 1}`,
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
      <div className="w-full min-h-screen flex items-center justify-center text-white bg-slate-900">
        <p className="text-xl">Loading game configuration...</p>
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-screen text-white overflow-hidden"
      style={{ background: "#1a1a2e" }}
    >
      {/* Desktop Decorative Borders */}
      <div
        className="fixed inset-0 d-none d-lg-block"
        style={{ pointerEvents: "none", zIndex: 0 }}
      >
        <div
          className="position-absolute top-0 bottom-0 start-0"
          style={{
            width: "calc((100vw - min(100vw, 1280px)) / 2)",
            background: "linear-gradient(90deg, rgba(139,0,0,0.3), transparent)",
          }}
        />
        <div
          className="position-absolute top-0 bottom-0 end-0"
          style={{
            width: "calc((100vw - min(100vw, 1280px)) / 2)",
            background: "linear-gradient(-90deg, rgba(139,0,0,0.3), transparent)",
          }}
        />
      </div>

      {/* MAIN CENTERED GAME AREA */}
      <div
        className="position-relative mx-auto d-flex flex-column"
        style={{
          width: "100%",
          maxWidth: "1280px",
          height: "100vh",
          zIndex: 1,
        }}
      >
        <TopBar />
        <PlayersList />
        <Timer />
        <CoinTray key={gameConfig?.gameId ?? 'default'} />

        {/* GAME CANVAS */}
        <div
          className="d-flex justify-content-center align-items-center flex-grow-1"
          style={{ padding: "0 10px" }}
        >
          <div
            ref={canvasRef}
            className="position-relative shadow-lg"
            style={{
              width: "100%",
              maxWidth: "1200px",
              aspectRatio: "16/9",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            {/* POTS CENTER SECTION */}
            <div
              className="position-absolute top-0 start-0 end-0 bottom-0 d-flex justify-content-center align-items-center"
              style={{
                padding: "6px",
                gap: "6px",
                // flexWrap: "wrap",
              }}
            >
              {pots.map((pot: any) => (
                <PotCard
                  key={pot.potIndex}
                  {...pot}
                  style={{
                    transform: "scale(0.75)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <MessageModal
          show={showModal}
          header={modalMessage.title}
          message={modalMessage.message}
          onClose={() => setShowModal(false)}
        />
        <ResultModal />
        <ToastContainer />
      </div>

      {/* SUPER RESPONSIVE GLOBAL STYLES */}
      <style jsx>{`
      @media (max-width: 400px) {
        .pot-card {
          transform: scale(0.6) !important;
        }
      }

      @media (max-width: 320px) {
        .pot-card {
          transform: scale(0.48) !important;
        }
      }

      @media (max-width: 260px) {
        .pot-card {
          transform: scale(0.40) !important;
        }
      }

      @media (max-width: 220px) {
        .pot-card {
          transform: scale(0.33) !important;
        }
      }

      @media (max-width: 190px) {
        .pot-card {
          transform: scale(0.28) !important;
        }
      }
    `}</style>
    </div>
  );
}