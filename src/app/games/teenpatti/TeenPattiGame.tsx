//TeenPattiGame.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import TopBar from './components/TopBar';
import PlayersList from './components/PlayersList';
import CoinTray from './components/CoinTray';
import PotCard from './components/PotCard';
import ResultModal from './components/ResultModal';
import Timer from './components/Timer';
import { useToast } from './components/Toast';
import { TeenPattiEngine } from './game/TeenPattiEngine';
import { gameConfiguration as fetchGameConfiguration } from '@/lib/socket/socketEventHandlers';
import { useAppSelector } from '@/lib/redux/hooks';
import { getCache, setCache } from '@/lib/cache';
import { SoundManager } from './game/SoundManager';
import { placeTeenpattiBet, teenpattiPotBetsAndUsers, useTeenpattiBetResponseListener } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';
import { useDispatch } from "react-redux";
import { setGameConfiguration } from '@/lib/redux/slices/teenpatti/gameConfiguration';

export default function TeenPattiGame() {
  const dispatch = useDispatch();
  const { ToastContainer, showToast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<TeenPattiEngine | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [gameConfig, setGameConfig] = useState<any>(null);
  const [potAndUsers, setPotAndUsers] = useState<any>(null);
    const latestBet = useAppSelector((s) => s.teenPattiBettingReducer.lastBet);

  const gameId = React.useMemo(() => ({ gameId: 16 }), []);
  const idNumber = gameId.gameId;
  const cacheKey = `game_config_${idNumber}`;

useEffect(() => {
  const cached = getCache(cacheKey);

  async function loadPotAndUsers() {
    try {
      const data = await teenpattiPotBetsAndUsers(gameId);
      setPotAndUsers(data);
    } catch (err) {
      console.error('[TeenPatti] Failed to fetch potAndUsers:', err);
    }
  }

  loadPotAndUsers();

  if (cached) {
    setGameConfig(cached);

    dispatch(setGameConfiguration(cached));  
    SoundManager.getInstance().loadSounds({
      timerUpSound: cached.timerUpSound,
      cardsShuffleSound: cached.cardsShuffleSound,
      betButtonAndCardClickSound: cached.betButtonAndCardClickSound,
    });
    return;
  }

  fetchGameConfiguration(gameId, (data: any) => {
    if (data) {
      setGameConfig(data);
      setCache(cacheKey, data);

      dispatch(setGameConfiguration(data));   
      SoundManager.getInstance().loadSounds({
        timerUpSound: data.timerUpSound,
        cardsShuffleSound: data.cardsShuffleSound,
        betButtonAndCardClickSound: data.betButtonAndCardClickSound,
      });
    }
  });
}, [gameId]);
   useTeenpattiBetResponseListener((data) => {
    if (data.success) {
      showToast(data.message ?? `Bet placed: ₹${data.amount}`, "success");
    } else {
      showToast(data.message ?? "Bet failed!", "error");
    }
  });

   useEffect(() => {
    if (!latestBet) return;

    console.log(" latestBet changed:", latestBet);

    // Emit only
    placeTeenpattiBet({
      userId: latestBet.userId,
      amount: latestBet.amount,
      tableId: latestBet.tableId,
      betType: latestBet.betType,
    });

  }, [latestBet]);
 
  const onCardClick = () => SoundManager.getInstance().play('betButtonAndCardClickSound');
  const onTimerUp = () => SoundManager.getInstance().play('timerUpSound');
  const onShuffleCards = () => SoundManager.getInstance().play('cardsShuffleSound');


  // Initialize PixiJS engine AFTER canvas and config are ready
  useEffect(() => {
    if (!canvasRef.current || !gameConfig) return;

    if (engine) return; // prevent re-init

    // ⚡ Wrap in requestAnimationFrame to ensure DOM is ready
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

      // Cleanup
      return () => {
        pixiEngine.destroy();
        setEngine(null);
        setConfigLoaded(false);
      };
    };

    const rafId = requestAnimationFrame(initEngine);
    return () => cancelAnimationFrame(rafId);

  }, [canvasRef, gameConfig]);

  // Flip all cards when engine is ready
  useEffect(() => {
    if (engine && configLoaded) {
      engine.flipAllCards();
    }
  }, [engine, configLoaded]);

  // Prepare pots only after config is loaded
  const pots = gameConfig?.cardImages.map((cards: string[], idx: number) => ({
    potIndex: idx,
    potName: `Pot ${idx + 1}`,
    totalBet: 1000 * (idx + 1),
    betCoins: gameConfig.bettingCoins,
    cardImages: cards,
    cardBackImages: gameConfig.cardBackImages[idx],
    isWinner: idx === 0,
    multiplier: gameConfig.returnWinngingPotPercentage[idx] || 1,
    showFront: true,
    onPotClick: () => {

    },
  })) || [];

  if (!gameConfig) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-white bg-slate-900">
        <p className="text-xl">Loading game configuration...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-900 text-white">
      <TopBar />
      <PlayersList />
      <Timer />
      <CoinTray  key={gameConfig}/>

      {/* Game Canvas */}
      <div
        ref={canvasRef}
        className="w-[1280px] h-[720px] mx-auto mt-24 bg-green-900 rounded-lg shadow-lg relative"
      >
        <div className="absolute inset-0 flex justify-around items-center">
          {pots.map((pot: any) => (
            <PotCard key={pot.potIndex} {...pot} />
          ))}
        </div>
      </div>
      <ResultModal />
      <ToastContainer />
    </div>
  );
}




