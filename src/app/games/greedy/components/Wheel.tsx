// Wheel.tsx
import Image from "next/image";
import Banana from "./Banana";
import Burger from "./Burger";
import Cherry from "./Cherry";
import Fish from "./Fish";
import Meat from "./Meat";
import Orange from "./Orange";
import Shrink from "./Shrink";
import Strawberry from "./Strawberry";
import GreedyTimer from "./GreedyTimer";
import { RootState } from "@/lib/redux/store";
import { useRef, useImperativeHandle, forwardRef } from "react";
import { useToast } from "../../teenpatti/components/Toast";
import { placeGreedyBet } from "@/lib/socket/game/greedy/greedySocketEventHandler";
import { useSelector, useDispatch } from 'react-redux';
import { placeBet } from "@/lib/redux/slices/teenpatti/teenPattiBettingSlice";
const cabins = [
    { pos: 'top-[2%] left-1/2', icon: <Burger />, mult: 'x10', index: 1 },
    { pos: 'top-[15%] left-[85%]', icon: <Shrink />, mult: 'x15', index: 2 },
    { pos: 'top-1/2 left-[98%]', icon: <Fish />, mult: 'x25', index: 3 },
    { pos: 'top-[85%] left-[85%]', icon: <Meat />, mult: 'x45', index: 4 },
    { pos: 'top-[98%] left-1/2', icon: <Cherry />, mult: 'x5', index: 5 },
    { pos: 'top-[85%] left-[15%]', icon: <Orange />, mult: 'x5', index: 6 },
    { pos: 'top-1/2 left-[2%]', icon: <Banana />, mult: 'x5', index: 7 },
    { pos: 'top-[15%] left-[15%]', icon: <Strawberry />, mult: 'x5', index: 8 },
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
    
      const { ToastContainer, showToast } = useToast();
       const dispatch = useDispatch();
    useImperativeHandle(ref, () => ({
        getCabinElement: (index: number) => cabinRefs.current.get(index) || null,
    }));

    const handleCabinClicked = (cabinIndex: number) => {
           if (!selectedCoin) {
                showToast(`Please select a coin to bet!`);
                return;
                }
                if(currentPhase!=='bettingTimer'){
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

        const rect = targetCabin.getBoundingClientRect();

        // The center of the cabin in viewport coordinates
        const endX = rect.left + rect.width / 2;
        const endY = rect.top + rect.height / 2;

        console.log(`Cabin ${cabinIndex + 1} clicked!`);
        console.log(`Cabin ${cabinIndex + 1} position:`, { left: rect.left, top: rect.top, centerX: endX, centerY: endY });

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
            {cabins.map((cabin) => (
                <div
                    key={cabin.index}
                    ref={(el) => { if (el) cabinRefs.current.set(cabin.index, el); }}
                    onClick={() => handleCabinClicked(cabin.index)}
                    className={`absolute ${cabin.pos} -translate-x-1/2 -translate-y-1/2
                            w-[56px] h-[70px] rounded-full
                            flex items-center justify-center
                            shadow-lg z-10 cursor-pointer hover:scale-110 active:scale-95
                            transition-transform duration-200 select-none`}
                                 >
                    <div className="pointer-events-none">
                        {cabin.icon}
                    </div>
                </div>
            ))}

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
        </>
    );
});

Wheel.displayName = 'Wheel';

export default Wheel;