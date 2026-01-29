// Wheel.tsx
import Image from "next/image";
import GreedyTimer from "./GreedyTimer";
import { RootState } from "@/lib/redux/store";
import { useRef, useImperativeHandle, forwardRef, useState } from "react";
import { useToast } from "../../teenpatti/components/Toast";
import { myGreedyMessagesFromServer, placeGreedyBet } from "@/lib/socket/game/greedy/greedySocketEventHandler";
import { useSelector, useDispatch } from 'react-redux';
import { placeBet } from "@/lib/redux/slices/teenpatti/teenPattiBettingSlice";
import { useCabinSpinEffect } from "./useCabinSpinEffect";
import { incrementUserBalance } from "@/lib/redux/slices/userSlice";
import { GameWinCoinsAnimation } from "@/app/components/GameWinCoinsAnimation";

const cabins = [
    { pos: 'top-[2%] left-1/2', mult: 'x10', index: 1, imageURL: '/BurgerGreedy.png' },
    { pos: 'top-[15%] left-[85%]', mult: 'x15', index: 2, imageURL: '/ShrinkGreedy.png' },
    { pos: 'top-1/2 left-[98%]', mult: 'x25', index: 3, imageURL: '/FishGreedy.png' },
    { pos: 'top-[85%] left-[85%]', mult: 'x45', index: 4, imageURL: '/MeatGreedy.png' },
    { pos: 'top-[98%] left-1/2', mult: 'x5', index: 5, imageURL: '/CherryGreedy.png' },
    { pos: 'top-[85%] left-[15%]', mult: 'x5', index: 6, imageURL: '/OrangeGreedy.png' },
    { pos: 'top-1/2 left-[2%]', mult: 'x5', index: 7, imageURL: '/AppleGreedy.png' },
    { pos: 'top-[15%] left-[15%]', mult: 'x5', index: 8, imageURL: '/StrawberryGreedy.png' },
];

const phaseLabels: Record<string, string> = {
    bettingTimer: 'Start Betting',
    winningCalculationTimer: 'Calculating',
    resultAnnounceTimer: 'Results',
    newGameStartTimer: 'Wait',
};

export interface WheelRef {
    getCabinElement: (index: number) => HTMLDivElement | null;
}

interface WheelProps {
    onCabinClick?: (index: number) => void;
    animateCoin: (amount: number, color: string, targetElement: HTMLElement) => void;
}

const Wheel = forwardRef<WheelRef, WheelProps>(({ onCabinClick, animateCoin }, ref) => {
    const currentPhase = useSelector((s: RootState) => s.teenpattiTimer.phase);
    const cabinRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const selectedCoin = useSelector((s: RootState) => s.selectedCoin.coin);
    const userPlayerData = useSelector((state: RootState) => state.userPlayerData);
    const tenant = useSelector((state: RootState) => state.tenantDetails.data);
    const [coinAnimation, setCoinAnimation] = useState({isActive: false, amount: 0, potIndex: 0});

    const { ToastContainer, showToast } = useToast();
    const dispatch = useDispatch();
    const winningPotIndex = useSelector((s: RootState) => s.winningPot.winningPotIndex);
    // Use spin effect
    const spinState = useCabinSpinEffect(currentPhase, winningPotIndex);

    useImperativeHandle(ref, () => ({
        getCabinElement: (index: number) => cabinRefs.current.get(index) || null,
    }));
    
    myGreedyMessagesFromServer((message) => {
        console.log("Received toGreedyWinnerMessage:", message);
        if (message.betType == 2 && message.winningAmount > 0) {
            setTimeout(() => {
                setCoinAnimation({
                    isActive: true,
                    amount: message.winningAmount,
                    potIndex: message.winningPotIndex,
                });
                dispatch(incrementUserBalance(message.winningAmount));
            }, 3000);
        }
    });
    
    const handleCoinAnimationComplete = () => {
        setCoinAnimation(prev => ({ ...prev, isActive: false }));
    };
    
    const handleCabinClicked = (cabinIndex: number) => {
        if (!selectedCoin) {
            showToast(`Please select a coin to bet!`);
            return;
        }
        if (currentPhase !== 'bettingTimer') {
            showToast(`Betting is closed now.`);
            return;
        }
        const balance = Number(userPlayerData.data?.balance || 0);
        const betAmount = Number(selectedCoin.amount);
        const currentUserId = userPlayerData.data?.id;
        
        if (!selectedCoin) {
            showToast(`Please select a coin to bet!`);
            return;
        }

        if (balance <= 0) {
            showToast(`Insufficient balance.`);
            return;
        }

        if (betAmount > balance) {
            showToast(`Insufficient balance.`);
            return;
        }
        
        const params = new URLSearchParams(window.location.search);
        const appKey = params.get("appKey");
        const gameId = params.get("gameId");
        const token = params.get("token");
        
        if (currentPhase !== 'bettingTimer') {
            showToast(`Betting closed. Wait`);
            return;
        }
        
        if (!currentUserId) {
            showToast(`User not found. Cannot place bet.`);
            return;
        }
        
        const tenantBaseURL =
            tenant.environemnt === "production"
                ? tenant.tenantProductionDomain
                : tenant.tenantTestingDomain;
        
        let betData = {
            userId: currentUserId.toString(),
            amount: betAmount,
            tableId: 10,
            betType: 1,
            potIndex: String(cabinIndex),
            socketId: "",
            appKey: appKey!,
            token: token!,
            gameId: gameId!,
            tenantBaseURL,
        }
        
        dispatch(placeBet({
            userId: currentUserId.toString(),
            amount: betAmount,
            tableId: 10,
            betType: 1,
            potIndex: cabinIndex,
        }));
        
        placeGreedyBet(betData);

        const targetCabin = cabinRefs.current.get(cabinIndex);
        if (!targetCabin) return;

        animateCoin(selectedCoin.amount, selectedCoin.color, targetCabin);
        onCabinClick?.(cabinIndex);
    };

    return (
        <>
            <div className="relative w-full max-w-[280px] aspect-square">
                {/* ===== SPOKES ===== */}
                <svg
                    viewBox="0 0 320 320"
                    className="absolute inset-0 w-full h-full z-0">
                    {[
                        [160, 160, 160, 40],
                        [160, 160, 255, 65],
                        [160, 160, 280, 160],
                        [160, 160, 255, 255],
                        [160, 160, 160, 280],
                        [160, 160, 65, 255],
                        [160, 160, 40, 160],
                        [160, 160, 65, 65],
                    ].map((l, i) => (
                        <line
                            key={i}
                            x1={l[0]}
                            y1={l[1]}
                            x2={l[2]}
                            y2={l[3]}
                            stroke="#fb923c"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                    ))}
                </svg>

                {/* ===== CABINS ===== */}
                {cabins.map((cabin) => {
                    const isHighlighted = spinState.currentHighlight === cabin.index;
                    const isWinner = spinState.isWinnerHighlighted && cabin.index === winningPotIndex;
                    const shouldFade = (currentPhase === 'winningCalculationTimer' || currentPhase === 'resultAnnounceTimer') && !isHighlighted;

                    return (
                        <div
                            key={cabin.index}
                            ref={(el) => { if (el) cabinRefs.current.set(cabin.index, el); }}
                            onClick={() => handleCabinClicked(cabin.index)}
                            data-pot-index={cabin.index}
                            className={`absolute ${cabin.pos} -translate-x-1/2 -translate-y-1/2
                                w-[80px] h-[80px] rounded-full
                                flex flex-col items-center justify-center
                                shadow-lg z-10 cursor-pointer hover:scale-110 active:scale-95
                                transition-all duration-200 select-none overflow-visible
                                ${isWinner 
                                    ? 'bg-gradient-to-b from-green-600 to-green-700 border-4 border-white shadow-[0_0_30px_rgba(74,222,128,0.9)]' 
                                    : 'bg-white border-[3px] border-orange-600'
                                }`}
                            style={{
                                opacity: shouldFade ? 0.3 : 1,
                            }}
                        >
                            {/* Food Image */}
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Image
                                    src={cabin.imageURL}
                                    alt={`Cabin ${cabin.index}`}
                                    width={50}
                                    height={50}
                                    className="object-contain pointer-events-none"
                                    loading="eager"
                                    priority={cabin.index <= 4}
                                />
                            </div>
                            
                            {/* Multiplier Badge */}
                            <div className={`absolute -top-2 -right-2 min-w-[30px] h-[30px] rounded-full 
                                flex items-center justify-center px-1
                                font-black text-white text-sm
                                border-[3px] border-white shadow-lg
                                ${isWinner 
                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse' 
                                    : 'bg-gradient-to-br from-red-500 to-red-700'
                                }`}
                                style={{
                                    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
                                }}
                            >
                                {cabin.mult}
                            </div>
                        </div>
                    );
                })}

                {/* ===== CENTER HUB ===== */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[100px] h-[100px] bg-orange-400 rounded-full shadow-xl
                        flex flex-col items-center justify-center z-20 overflow-visible"
                >
                    <Image
                        src="/DealarAvatarGreedy-removebg-preview.png"
                        width={150}
                        height={150}
                        alt="Dealer"
                        className="absolute -top-10 pointer-events-none"
                        loading="eager"
                        priority
                    />
                    <div className="text-white text-center font-bold text-sm leading-tight z-10">
                        <div className="text-[13px] font-semibold relative z-10 top-1">
                            {currentPhase && phaseLabels[currentPhase]}
                        </div>
                        <div className="text-lg font-extrabold relative z-10 top-1">
                            <GreedyTimer />
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <GameWinCoinsAnimation
                isActive={coinAnimation.isActive}
                amount={coinAnimation.amount}
                potIndex={coinAnimation.potIndex}
                onComplete={handleCoinAnimationComplete}
            />
        </>
    );
});

Wheel.displayName = 'Wheel';

export default Wheel;