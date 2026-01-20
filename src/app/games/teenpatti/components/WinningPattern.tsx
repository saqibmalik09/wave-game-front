'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useTeenpattiPatternResponse } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';

interface WinningPattern {
  winningPotIndex: number;
  winningPotImageURL: string;
}

const INITIAL_VISIBLE = 3;
const STEP = 1;
const MAX_SCROLL_ITEMS = 5;

export default function WinningPatternPanel() {
  const [patterns, setPatterns] = useState<WinningPattern[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [expanded, setExpanded] = useState(false);

  useTeenpattiPatternResponse((response) => {
    if (response?.success && Array.isArray(response.data)) {
      setPatterns(response.data);
    }
  });

  const hasMore = visibleCount < patterns.length;

  const visiblePatterns = useMemo(
    () => patterns.slice(0, visibleCount),
    [patterns, visibleCount]
  );

  const handleToggle = () => {
    if (!patterns.length) return;

    if (hasMore) {
      setExpanded(true);
      setVisibleCount((prev) =>
        Math.min(prev + STEP, patterns.length)
      );
    } else {
      setExpanded(false);
      setVisibleCount(INITIAL_VISIBLE);
    }
  };

  return (
    <aside
      onClick={handleToggle}
      className="absolute right-1 
        w-9 bg-blue-500 rounded-xl px-1 py-2
        flex flex-col items-center gap-2 shadow-lg z-20
        cursor-pointer select-none"
    >
      <div className="text-white text-[10px] font-extrabold">
        Result
      </div>

      {!patterns.length ? (
        <div className="flex justify-center items-center h-[120px]">
          <span
            className="text-white text-[9px] font-semibold tracking-widest"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            Loading Data...
          </span>
        </div>
      ) : (
        <div
          className="flex flex-col gap-1"
          style={{
            maxHeight: expanded ? `${MAX_SCROLL_ITEMS * 36}px` : 'auto',
            overflowY: expanded ? 'auto' : 'visible',
            scrollbarWidth: 'none',
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {visiblePatterns.map((item, idx) => (
            <div
              key={`${item.winningPotIndex}-${idx}`}
              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow"
            >
              <Image
                src={`${item.winningPotImageURL}`}
                alt={`Winning Pot ${item.winningPotIndex}`}
                width={26}
                height={26}
                unoptimized
                className="object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
