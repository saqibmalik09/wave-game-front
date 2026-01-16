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
import { gameTeenPattiResultAnnounce, myMessagesFromServer, placeTeenpattiBet, teenpattiGameTableJoin, useTeenpattiBetResponseListener } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';
import { useDispatch, useSelector } from "react-redux";
import { setGameConfiguration } from '@/lib/redux/slices/teenpatti/gameConfiguration';
import { setTenantDetails } from '@/lib/redux/slices/tenantDetails';
import { incrementUserBalance, setUserPlayerInfo } from '@/lib/redux/slices/userSlice';
import { setPendingCoin } from '@/lib/redux/slices/teenpatti/coinDropAnimation';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '@/lib/redux/store';
import GameLoading from "@/app/components/GameLoading";
import { CoinsAnimation } from './components/CoinsAnimation';
import { useTeenpattiBetSumResponse } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';

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
  bettingTimer: 'Betting',
  winningCalculationTimer: 'Calculating',
  resultAnnounceTimer: 'Announcing',
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
  // const winningPotIndex = useSelector((s: RootState) => s.winningPot.winningPotIndex);
  const currentPhase = useSelector((s: RootState) => s.teenpattiTimer.phase);
  const tenant = useSelector((state: RootState) => state.tenantDetails.data);
  const [showModal, setShowModal] = useState(false);
  const [playerData, setPlayerData] = useState<UserData | null>(null);
  // const [tenantData, setTenantData] = useState<TenantData>();
  const [modalMessage, setModalMessage] = useState({ title: "", message: "" });
  const [coinAnimation, setCoinAnimation] = useState({isActive: false,amount: 0,potIndex: 0});
  const [potBetSum, setPotBetSum] = useState<Record<number, number>>({
    0: 0,
    1: 0,
    2: 0,
  });
const [winningCards, setWinningCards] = useState<string[] | null>(null);
const [loserCards, setLoserCards] = useState<{
  cardsA: string[];
  cardsB: string[];
} | null>(null);

const [winningPotIndex, setWinningPotIndex] = useState<number | null>(null);
  const [gameLoadedFully, setGameLoadedFully] = useState<boolean>(false);

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
    console.log("Fetching game configuration from socket...");
    fetchGameConfiguration(gameId, (data: any) => {
      console.log("Game configuration received:", data);
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
  }, [gameId,gameLoadedFully]);

  useEffect(() => {
    if (
      currentPhase === "resultAnnounceTimer" ||
      currentPhase === "newGameStartTimer"
    ) {
      fetchUserInfo(); // <-- call here
    }
  }, [currentPhase]);
  myMessagesFromServer((message)=>{
    if(message.betType==2 && message.winningAmount>0){
         setCoinAnimation({
          isActive: true,
          amount: message.winningAmount,
          potIndex:message.winningPotIndex,
          
        });
     dispatch(incrementUserBalance(message.winningAmount));
    }
  })
  gameTeenPattiResultAnnounce((response)=>{
    if(response.success){
      let winningCards= response.data.winningCards;
      let loserCards= response.data.loserCards;
       let winningPotIndex= response.data.winningPotIndex;
      setWinningCards(winningCards)
      setLoserCards(loserCards)
      setWinningPotIndex(winningPotIndex)
    }
  })
  useTeenpattiBetResponseListener((data) => {
    console.log("Teenpatti Bet useTeenpattiBetResponseListener:", data);
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
  const handleCoinAnimationComplete = () => {
    setCoinAnimation(prev => ({ ...prev, isActive: false }));
  };
  // useEffect(() => {
    // if (!latestBet || !userInfo || !tenant) return;
   
    // const potIndex = Number(latestBet.potIndex);
    // const betAmount = Number(latestBet.amount);
    //     setPotBetSum((prev) => {
    //   const newSum = {
    //     ...prev,
    //     [potIndex]: (prev[potIndex] || 0) + betAmount,
      // };
      // console.log("Updated potBetSum:", newSum); 
      // return newSum;
    // })
  
  // }, [latestBet]);
useTeenpattiBetSumResponse((data) => {
  console.log("potbetsum in useTeenpattiBetSumResponse:",data)
  if (!data) return;
  setPotBetSum(prev => ({
    ...prev,
    0: data[0] ?? prev[0],
    1: data[1] ?? prev[1],
    2: data[2] ?? prev[2],
  }));
});

useEffect(() => {
    if (currentPhase === 'newGameStartTimer') {
      setPotBetSum({
        0: 0,
        1: 0,
        2: 0,
      });
    }
  }, [currentPhase]);
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
  useEffect(() => {
    if (gameConfig) {
      setTimeout(() => {
        setGameLoadedFully(true);
      }, 2000); // small delay to ensure smooth transition
    }
  }, [gameConfig]);
const getCardsForPot = (idx: number): string[] => {
  // Before result → backs
  if (!winningCards || !loserCards || winningPotIndex === null) {
    return gameConfig?.cardBackImages[idx] || [];
  }
  if (idx === winningPotIndex) {
    return winningCards;
  }
  const loserIndex = idx < winningPotIndex ? idx : idx - 1;
  return loserIndex === 0
    ? loserCards.cardsA
    : loserCards.cardsB;
};

 const pots = gameConfig?.cardBackImages.map((_, idx) => ({
    potIndex: idx,
    potName: `Pot ${String.fromCharCode(65 + idx)}`,
    totalBet: potBetSum[idx] ?? 10,
    betCoins: gameConfig.bettingCoins,
    cardImages: getCardsForPot(idx),  
    cardBackImages: gameConfig.cardBackImages[idx],
    isWinner: idx === winningPotIndex,
  })) || [];


  if (!gameConfig || !gameLoadedFully) {
    return (
      <div>
        <GameLoading message="Hold on " />
      </div>
    );
  }

  return (
      <>
       <div className="relative w-full min-h-screen max-w-md mx-auto overflow-hidden" >

          {/* Top Bar - Fixed at top */}
          <div className="absolute top-0 left-3 w-full z-50">
            <TopBar />
          </div>

          {/* Left Players List - Absolute positioned */}
          <div className="absolute left-2 top-[15%] z-40">
            <PlayersList />
          </div>

          {/* Pots Container - Positioned at 68% from top */}
          <div className="absolute top-[63%] left-[56%] z-30 -translate-x-1/2 -translate-y-1/2 flex gap-0.5 px-1">
            {pots.map((pot) => (
              <React.Fragment key={pot.potIndex}>

                {/* Timer above POT 0 */}
                {pot.potIndex === 0 && (
                  <span className="absolute -top-9 left-[17%] -translate-x-1/2 z-40">
                    <Timer />
                  </span>
                )}

                {/* Yellow Label above POT 1 */}
                {pot.potIndex === 2 && currentPhase && phaseLabels[currentPhase] && (
                  <span className="absolute -top-6 left-[80%] -translate-x-1/2 z-40 pointer-events-none">
                    <span
                      className="relative flex items-center justify-center select-none"
                      style={{
                        minWidth: "clamp(40px, 14vw, 22px)",
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
           <CoinsAnimation
          isActive={coinAnimation.isActive}
          amount={coinAnimation.amount}
          potIndex={coinAnimation.potIndex}
          onComplete={handleCoinAnimationComplete}
        />
        </div>

      </>
  
  );

}