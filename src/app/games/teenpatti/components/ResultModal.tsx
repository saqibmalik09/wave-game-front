'use client';
import React, { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/lib/socket/socketClient';
import { useAppSelector } from '@/lib/redux/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { clearWinningPot, setWinningPotIndex } from '@/lib/redux/slices/teenpatti/winningPotSlice';
import { gameTeenPattiResultAnnounce } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';

interface ResultData {
  winners: any[]; // you can make a proper type if you know the structure
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
  const [result, setResult] = useState<ResultData | null>(null);
  const [manualClosed, setManualClosed] = useState(false);
  const dispatch = useDispatch();
  const userPlayerData = useSelector((state: RootState) => state.userPlayerData);
  const currentUserId = userPlayerData.data?.id;

  const currentPhase = useAppSelector((state) => state.teenpattiTimer.phase);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   const socket = getSocket();
  //   if (!socket) {
  //     console.log('Socket not initialized in result modal');
  //     return;
  //   };

  //   const handleResult = (response: ResultResponse) => {
  //     console.log('Received teenpattiAnnounceGameResultResponse33:', response);
  //     if (!response?.success || !response.data) return;
  //     // If user manually closed, ignore showing again
  //     if (manualClosed) return;

  //     setResult(response.data);
  //     dispatch(setWinningPotIndex(response.data.winningPotIndex));
  //     // Clear previous timeout
  //     if (timeoutRef.current) clearTimeout(timeoutRef.current);

  //     // Show modal after 3 seconds
  //     timeoutRef.current = setTimeout(() => {
  //       setShow(true);
  //     }, 3000);
  //   };

  //   socket.on('teenpattiAnnounceGameResultResponse', handleResult);

  //   return () => {
  //     socket.off('teenpattiAnnounceGameResultResponse', handleResult);
  //     if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //   };
  // }, [manualClosed, dispatch]);
  gameTeenPattiResultAnnounce((response: ResultResponse) => {
  if (!response?.success || !response.data) return;
  if (manualClosed) return;

  setResult(response.data);
  dispatch(setWinningPotIndex(response.data.winningPotIndex));

  if (timeoutRef.current) clearTimeout(timeoutRef.current);

  timeoutRef.current = setTimeout(() => {
    setShow(true);
  }, 2000);
});


  // Close modal on phase change or manual close
  useEffect(() => {
    if (!currentPhase) return;

    // Close when new game starts or phase changes to any other
    if (currentPhase !== 'resultAnnounceTimer') {
      setShow(false);
      setManualClosed(false); // reset manual close for next round
      dispatch(clearWinningPot());

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [currentPhase, dispatch]);

  // Manual close
  const handleClose = () => {
    setShow(false);
    setManualClosed(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };


  if (!show || !result) return null;

  const currentUserWinner = result.winners.find((w) => w.userId === String(currentUserId));
  const isWinner = !!currentUserWinner;

 return (
  <>
    {/* Backdrop */}
    <div
      className="position-fixed top-0 start-0 w-100 "
      style={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={handleClose}
    />

    {/* Modal */}
    <div
      className="position-fixed top-50 start-50 translate-middle rounded-4 overflow-hidden d-flex flex-column"
      style={{
        width: '70%',
        height: '90%',
        maxWidth: '250px',
        background: 'linear-gradient(180deg, #6b1f2b 0%, #4a1520 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        zIndex: 101,
        animation: 'scaleIn 0.25s ease',
      }}
    >
      {/* Header */}
      <div className="text-center flex-shrink-0 pt-2">
        <h5
          className="text-white fw-bold m-0"
          style={{ fontSize: 'clamp(15px, 1vw, 10px)' }}
        >
          {isWinner ? '🎉 You Won!' : 'Round Complete'}
        </h5>

        <p
          className="text-warning fw-semibold m-0"
          style={{ fontSize: 'clamp(12px, 3vw, 18px)' }}
        >
          Winning Pot: {result.winningPot.toUpperCase()}
        </p>

        <p
          className="text-white-50 m-0"
          style={{ fontSize: 'clamp(12px, 1vw, 12px)' }}
        >
          {result.winningPotRankText}
        </p>
      </div>

      {/* Winning Cards */}
      <div className="d-flex justify-content-center gap-1 p-1 flex-shrink-0">
        {result.winningCards.map((cardUrl, idx) => (
          <img
            key={idx}
            src={`${process.env.NEXT_PUBLIC_BACKEND_ASSET_URL}/${cardUrl}`}
            alt={`Card ${idx + 1}`}
            className="rounded-3"
            style={{
              width: 'clamp(50px, 16vw, 100px)',
              height: 'clamp(70px, 12vw, 80px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          />
        ))}
      </div>

      {/* Winners Section - Scrollable */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ 
          background: 'rgba(0,0,0,0.3)',
          minHeight: 0,
        }}
      >
        <h5
          className="text-white fw-semibold text-center flex-shrink-0 pt-2 mb-1"
          style={{ fontSize: '10px' }}
        >
          {result.winners.length > 1 ? 'Winners' : 'Winner'}
        </h5>

        <div
          className="flex-grow-1 px-2 pb-2"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div className="d-flex flex-column gap-1">
            {result.winners.map((winner) => (
              <div
                key={winner.userId}
                className="d-flex align-items-center p-1 justify-content-between rounded-3"
                style={{
                  background:
                    winner.userId === String(currentUserId)
                      ? 'rgba(255,215,0,0.18)'
                      : 'rgba(255,255,255,0.08)',
                }}
              >
                <div className="d-flex align-items-center gap-1">
                  <img
                    src={winner.imageProfile}
                    alt="Winner"
                    className="rounded-circle"
                    style={{
                      width: '25px',
                      height: '25px',
                      objectFit: 'cover',
                      border: '2px solid #ffd700',
                    }}
                  />
                  <span className="text-white" style={{ fontSize: '12px' }}>
                    {winner.name ?? "Ricolive"}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span
                    className="d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
                      color: '#000',
                      fontSize: '11px',
                      flexShrink: 0,
                    }}
                  >
                    G
                  </span>
                  <span
                    className="text-warning fw-bold"
                    style={{ fontSize: '13px' }}
                  >
                    +{winner.amountWon.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Fixed at Bottom */}
      <div className="p-2 flex-shrink-0">
        <button
          onClick={handleClose}
          className="btn w-100 fw-bold rounded-pill"
          style={{
            padding: '8px',
            fontSize: '12px',
            background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
            color: '#000',
            border: 'none',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  </>
);
}