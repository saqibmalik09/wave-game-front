'use client';
import React, { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/lib/socket/socketClient';
import { useAppSelector } from '@/lib/redux/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { clearWinningPot, setWinningPotIndex } from '@/lib/redux/slices/teenpatti/winningPotSlice';

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

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleResult = (response: ResultResponse) => {
      if (!response?.success || !response.data) return;

      // If user manually closed, ignore showing again
      if (manualClosed) return;

      setResult(response.data);
      dispatch(setWinningPotIndex(response.data.winningPotIndex));

      // Clear previous timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Show modal after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setShow(true);
      }, 3000);
    };

    socket.on('teenpattiAnnounceGameResultResponse', handleResult);

    return () => {
      socket.off('teenpattiAnnounceGameResultResponse', handleResult);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [manualClosed, dispatch]);

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
      className="position-fixed top-0 start-0 w-100 h-100"
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
      className="position-fixed top-50 start-50 translate-middle rounded-4 overflow-hidden"
      style={{
        width: '60%',
        maxWidth: '250px', // 🔹 SMALL SCREEN
        background: 'linear-gradient(180deg, #6b1f2b 0%, #4a1520 100%)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        zIndex: 101,
        animation: 'scaleIn 0.25s ease',
      }}
    >
      {/* <button
        onClick={handleClose}
        className="btn btn-dark position-absolute top-0 end-0 rounded-circle"
        style={{
          width: '34px',
          height: '34px',
          margin: '10px',
          zIndex: 10,
        }}
      >
        ×
      </button> */}

      {/* Header */}
      <div className="text-center pt-2 pb-2 px-2">
        <h2
          className="text-white fw-bold mb-1"
          style={{ fontSize: 'clamp(16px, 2vw, 18px)' }}
        >
          {isWinner ? '🎉 You Won!' : 'Round Complete'}
        </h2>

        <p
          className="text-warning fw-semibold mb-1"
          style={{ fontSize: 'clamp(12px, 3vw, 18px)' }}
        >
          Winning Pot: {result.winningPot.toUpperCase()}
        </p>

        <p
          className="text-white-50"
          style={{ fontSize: 'clamp(11px, 2.5vw, 14px)' }}
        >
          {result.winningPotRankText}
        </p>
      </div>

      {/* Winning Cards */}
      <div className="d-flex justify-content-center gap-2 px-3 py-2">
        {result.winningCards.map((cardUrl, idx) => (
          <img
            key={idx}
            src={cardUrl}
            alt={`Card ${idx + 1}`}
            className="rounded-3"
            style={{
              width: 'clamp(44px, 14vw, 70px)',
              height: 'clamp(64px, 20vw, 100px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          />
        ))}
      </div>

      {/* Winners */}
      <div
        className="px-3 py-2"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        <h3
          className="text-white fw-semibold mb-2 text-center"
          style={{ fontSize: '14px' }}
        >
          {result.winners.length > 1 ? 'Winners' : 'Winner'}
        </h3>

        <div
          className="d-flex flex-column gap-2"
          style={{
            maxHeight: '140px', // 🔹 SMALL SCREEN HEIGHT
            overflowY: 'auto',
          }}
        >
          {result.winners.map((winner) => (
            <div
              key={winner.userId}
              className="d-flex align-items-center justify-content-between p-2 rounded-3"
              style={{
                background:
                  winner.userId === String(currentUserId)
                    ? 'rgba(255,215,0,0.18)'
                    : 'rgba(255,255,255,0.08)',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <img
                  src={winner.imageProfile}
                  alt="Winner"
                  className="rounded-circle"
                  style={{
                    width: '34px',
                    height: '34px',
                    objectFit: 'cover',
                    border: '2px solid #ffd700',
                  }}
                />

                <div className="d-flex align-items-center gap-1">
                  <span
                    className="d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, #ffd700, #ffed4e)',
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
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2">
        <button
          onClick={handleClose}
          className="btn w-100 fw-bold rounded-pill"
          style={{
            padding: '10px',
            fontSize: '14px',
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
