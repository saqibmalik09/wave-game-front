// BottomBar.tsx
'use client';

import { RootState } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { setCoin } from "@/lib/redux/slices/teenpatti/selectedCoinSlice";
import { SoundManager } from "../../teenpatti/game/SoundManager";
import { useGreedyBetResponseListener } from "@/lib/socket/game/greedy/greedySocketEventHandler";
import { incrementUserBalance, setUserPlayerInfo } from '@/lib/redux/slices/userSlice';

import { setPendingCoin } from "@/lib/redux/slices/teenpatti/coinDropAnimation";
const COINS = [100, 1000, 5000, 10000, 50000];
const COLORS = ['#34d399', '#22c55e', '#16a34a', '#15803d', '#166534'];

export default function BottomBar() {
  const dispatch = useDispatch();
  const userPlayerData = useSelector((state: RootState) => state.userPlayerData);

  const [selectedCoin, setSelectedCoin] = useState<number | null>(null);
  const initialized = useRef(false);

  // auto select first coin
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setSelectedCoin(COINS[0]);
      dispatch(setCoin({ amount: COINS[0], color: COLORS[0] }));
    }
  }, [dispatch]);
 useGreedyBetResponseListener((data) => {
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
  const selectCoin = (amount: number, color: string) => {
    // SoundManager.getInstance().play('betButtonAndCardClickSound');
    setSelectedCoin(amount);
    dispatch(setCoin({ amount, color }));
  };

  return (
    <div className="absolute bottom-5 left-0 right-0
      flex justify-between items-center
      px-2 pb-2 pt-2 z-30 flex-wrap gap-2">

      {/* Balance */}
      <div className="flex items-center gap-2 bg-white/95
        px-3 py-2 rounded-full shadow">
        <span className="text-green-600 font-extrabold text-lg">G</span>
        <span className="font-extrabold text-green-800">
          {userPlayerData?.data?.balance?.toLocaleString() || '0'}
        </span>
        <button className="w-6 h-6 bg-green-500 text-white
          rounded-full font-bold">+</button>
      </div>

      {/* Coins */}
      <div className="flex gap-2">
        {COINS.map((amount, index) => {
          const isSelected = selectedCoin === amount;

          return (
            <button
              key={amount}
              onClick={() => selectCoin(amount, COLORS[index])}
              className="w-11 h-11 rounded-full
                bg-emerald-400 font-extrabold text-xs shadow
                transition-all duration-200"
              style={{
                transform: isSelected
                  ? 'translateY(-6px) scale(1.08)'
                  : 'translateY(0)',
                filter: isSelected ? 'brightness(1.15)' : 'brightness(1)',
              }}
            >
              {amount >= 1000 ? `${amount / 1000}k` : amount}
            </button>
          );
        })}
      </div>
    </div>
  );
}
