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
import { useToast } from "../../teenpatti/components/Toast";
const COINS = [100, 1000, 5000, 10000, 50000];
const COLORS = ['#044b31', '#795300', '#560c97', '#8a0669', '#134705'];

export default function BottomBar() {
  const dispatch = useDispatch();
  const { ToastContainer, showToast } = useToast();

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
    setSelectedCoin(amount);
    dispatch(setCoin({ amount, color }));
  };

  return (
    <>
      <div className="absolute bottom-5 left-0 right-0
        flex flex-row justify-between items-center
        px-2 sm:px-4 pb-2 pt-2 z-30 gap-2 rounded-full">

        {/* Balance - Flexible width */}
        <div className="flex items-center gap-1 sm:gap-2 bg-white/95
          px-2 sm:px-3 py-1.5 sm:py-2 rounded-full shadow flex-shrink-0">
          <span className="text-green-600 font-extrabold text-sm sm:text-lg">G</span>
          <span className="font-extrabold text-green-800 text-xs sm:text-base whitespace-nowrap">
            {userPlayerData?.data?.balance?.toLocaleString() || '0'}
          </span>
          <button className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 text-white
            rounded-full font-bold text-xs sm:text-sm">+</button>
        </div>

        {/* Coins - Responsive sizing */}
        <div className="flex gap-1 sm:gap-2 flex-shrink-0 rounded-full">
          {COINS.map((amount, index) => {
            const isSelected = selectedCoin === amount;

            return (
              <button
                key={amount}
                onClick={() => selectCoin(amount, COLORS[index])}
                className="
                  relative
                  w-8 h-8 text-[9px]
                  xs:w-9 xs:h-9 xs:text-[10px]
                  sm:w-11 sm:h-11 sm:text-xs
                  transition-all
                "
              >
                {/* SELECTION BORDER (YELLOW BOX) */}
                {isSelected && (
                  <div
                    className="absolute -inset-[4px] rounded-[10px] border-2"
                    style={{
                      background: "linear-gradient(135deg, #50420a, #ec4899, #10b981, #021430)",
                      // Yellow -> Pink -> Green -> Blue, readable over blue coin
                    }}
                  />
                )}


                {/* WHITE OUTER RING */}
                <div className="absolute inset-0 rounded-full bg-white p-[2px]">

                  {/* COLORED RING */}
                  <div
                    className="w-full h-full rounded-full p-[2px]"
                    style={{ backgroundColor: COLORS[index] }}
                  >
                    {/* INNER COIN */}
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center
                                font-extrabold text-white shadow-inner border border-white/40"
                      style={{
                        background: `
                          repeating-linear-gradient(
                            45deg,
                            rgba(128, 11, 196, 0.15),
                            rgba(223, 28, 28, 0.15) 6px,
                            rgba(19, 23, 255, 0.1) 6px,
                            rgba(17, 204, 48, 0.1) 12px
                          )
                        `,
                      }}
                    >
                      {amount >= 1000 ? `${amount / 1000}k` : amount}
                    </div>
                  </div>
                </div>
              </button>

            );
          })}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}