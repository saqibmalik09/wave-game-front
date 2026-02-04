'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { clearWinningPot, setWinningPotIndex } from '@/lib/redux/slices/teenpatti/winningPotSlice';
import { gameGreedyResultAnnounce } from '@/lib/socket/game/greedy/greedySocketEventHandler';
import { useWindowSize } from '@/app/components/useWindowSize';
import { FiX } from 'react-icons/fi';

interface ResultData {
  winners: {
    userId: string;
    name: string;
    imageProfile: string;
    amountWon: number;
  }[];
  winningPot: string;
  winningPotIndex: number;
  winningCards: string[];
  winningPotRankText: string;
}

interface ResultResponse {
  success: boolean;
  message: string;
  data?: ResultData;
}

export default function ResultModal() {
  const [show, setShow] = useState(false);
  const { width } = useWindowSize();
  const [result, setResult] = useState<ResultData | null>(null);
  const [manualClosed, setManualClosed] = useState(false);
  const [timer, setTimer] = useState(3);
  const dispatch = useDispatch();
  const userPlayerData = useSelector((state: RootState) => state.userPlayerData);
  const currentUserId = userPlayerData.data?.id;
  const currentPhase = useAppSelector((state) => state.teenpattiTimer.phase);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for result event
  gameGreedyResultAnnounce((response: ResultResponse) => {
    if (!response?.success || !response.data) return;
    if (manualClosed) return;

    setResult(response.data);
    dispatch(setWinningPotIndex(response.data.winningPotIndex));

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(true), 3500);
  });

  // Close modal on phase change
  useEffect(() => {
    if (!currentPhase) return;
    if (currentPhase !== 'resultAnnounceTimer') {
      setShow(false);
      setManualClosed(false);
      setTimer(3);
      dispatch(clearWinningPot());
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [currentPhase, dispatch]);

  // Timer countdown
  useEffect(() => {
    if (!show) return;
    if (timer <= 0) return handleClose();

    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [show, timer]);

  const handleClose = () => {
    setShow(false);
    setManualClosed(true);
    setTimer(3);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  if (!show || !result) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999]"
        onClick={handleClose}
      />

      {/* Bottom Sheet Modal */}
      <div
        className="fixed bottom-0 left-0 w-full max-w-md mx-auto rounded-t-3xl overflow-hidden bg-gradient-to-b from-purple-700 to-purple-900 text-white z-[1000] shadow-lg animate-slideUp"
        style={{ maxHeight: '70%' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center py-3 px-4 border-b border-white/20 relative">
          <h3 className="text-lg font-bold">Round Results</h3>
          <div className="flex items-center gap-3">
            <span className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {timer}s
            </span>
            <button
              onClick={handleClose}
              className="text-white text-xl hover:text-yellow-400 transition"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Winners List */}
        <div className="flex flex-col gap-1 p-2 overflow-y-auto max-h-100">
          {result.winners.map((winner) => (
            <div
              key={winner.userId}
              className="flex items-center justify-between bg-white/10 rounded-xl p-1"
            >
              <div className="flex items-center gap-3">
                <img
                  src={winner.imageProfile}
                  alt={winner.name}
                  className="w-12 h-12 rounded-full border-2 border-yellow-400 object-cover"
                />
                <p className="font-semibold">{winner.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold"
                  style={{ fontSize: '14px' }}
                >
                  G
                </span>
                <span className="text-yellow-300 font-semibold">
                  {winner.amountWon.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
