'use client';
import React, { useEffect, useState, useRef } from 'react';
import { getSocket } from '@/lib/socket/socketClient';
import { useAppSelector } from '@/lib/redux/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { clearWinningPot, setWinningPotIndex } from '@/lib/redux/slices/teenpatti/winningPotSlice';

interface Winner {
  userId: string;
  amountWon: number;
  imageProfile: string;
}

interface ResultData {
  winners: Winner[];
  winningPot: string;
  winningCards: string[];
  winningPotRankText: string;
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

  const handleClose = () => {
    setShow(false);
    setManualClosed(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleResult = (response: any) => {
      if (!response?.success || !response.data) return;
      let winningPotIndex=response.data.winningPotIndex;
      let winners=response.data.winners;
      if (manualClosed) return; 

      setResult(response.data);
      dispatch(setWinningPotIndex(winningPotIndex))
      // Clear previous timeout if any
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
       
      // Show modal after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setShow(true);
        
        timeoutRef.current = setTimeout(() => {
          setShow(false);
          dispatch(clearWinningPot());
        }, 5000);
      }, 3000);
    };

    socket.on('teenpattiAnnounceGameResultResponse', handleResult);

    return () => {
      socket.off('teenpattiAnnounceGameResultResponse', handleResult);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [manualClosed]);

  useEffect(() => {
    // Reset manualClosed when new game starts
    if (currentPhase === 'bettingTimer') {
      setManualClosed(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [currentPhase]);

  if (!show || !result) return null;

  const currentUserWinner = result.winners.find((w) => w.userId === String(currentUserId));
  const isWinner = !!currentUserWinner;

  return (
    <>
      {/* Backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          animation: 'fadeIn 0.3s ease',
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="position-fixed top-50 start-50 translate-middle rounded-4 overflow-hidden"
        style={{
          width: '90%',
          maxWidth: '500px',
          background: 'linear-gradient(180deg, #6b1f2b 0%, #4a1520 100%)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
          zIndex: 101,
          animation: 'scaleIn 0.3s ease',
        }}
      >
        <button
          onClick={handleClose}
          className="btn btn-dark position-absolute top-0 end-0 m-3 rounded-circle"
          style={{ width: '40px', height: '40px', zIndex: 10 }}
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center pt-5 pb-3 px-4 position-relative">
          <h2 className="text-white fw-bold mb-2">
            {isWinner ? '🎉 You Won!' : 'Round Complete'}
          </h2>
          <p className="text-warning fw-semibold mb-1" style={{ fontSize: '18px' }}>
            Winning Pot: {result.winningPot.toUpperCase()}
          </p>
          <p className="text-white-50" style={{ fontSize: '14px' }}>
            {result.winningPotRankText}
          </p>
        </div>

        {/* Winning Cards */}
        <div className="d-flex justify-content-center gap-2 px-4 py-3">
          {result.winningCards.map((cardUrl, idx) => (
            <img
              key={idx}
              src={cardUrl}
              alt={`Card ${idx + 1}`}
              className="rounded-3"
              style={{ width: '70px', height: '100px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)' }}
            />
          ))}
        </div>

        {/* Winners List */}
        <div className="px-4 py-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <h3 className="text-white fw-semibold mb-3 text-center" style={{ fontSize: '16px' }}>
            {result.winners.length > 1 ? 'Winners' : 'Winner'}
          </h3>
          <div className="d-flex flex-column gap-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {result.winners.map((winner) => (
              <div
                key={winner.userId}
                className="d-flex align-items-center justify-content-between p-2 rounded-3"
                style={{
                  background: winner.userId === String(currentUserId) ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.1)',
                  border: winner.userId === String(currentUserId) ? '2px solid rgba(255,215,0,0.5)' : 'none',
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={winner.imageProfile}
                    alt="Winner"
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover', border: '2px solid #ffd700' }}
                  />
                  <div>
                    <p className="text-white mb-0 fw-semibold" style={{ fontSize: '14px' }}>
                      {winner.userId === String(currentUserId) ? 'You' : `User ${winner.userId.slice(-4)}`}
                    </p>
                    <p className="text-warning mb-0 fw-bold" style={{ fontSize: '12px' }}>
                      +₹{winner.amountWon.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 text-center">
          <button
            onClick={handleClose}
            className="btn w-100 py-3 fw-bold text-white rounded-pill"
            style={{ background: 'linear-gradient(135deg, #ffd700, #ffed4e)', color: '#000', border: 'none' }}
          >
            Continue
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
      `}</style>
    </>
  );
}
