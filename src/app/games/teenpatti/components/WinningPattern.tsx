'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useTeenpattiPatternResponse } from '@/lib/socket/game/teenpatti/teenpattiSocketEventHandler';

interface WinningPattern {
  winningPotIndex: number;
  winningPotImageURL: string;
}

const INITIAL_VISIBLE = 5;
const MAX_VISIBLE_ITEMS = 8;

export default function WinningPatternPanel() {
  const [patterns, setPatterns] = useState<WinningPattern[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useTeenpattiPatternResponse((response) => {
    if (response?.success && Array.isArray(response.data)) {
      setPatterns(response.data);
    }
  });

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Calculate visible count based on expanded state
  const maxVisibleCount = isExpanded ? patterns.length : INITIAL_VISIBLE;
  const visiblePatterns = useMemo(
    () => patterns.slice(0, maxVisibleCount),
    [patterns, maxVisibleCount]
  );

  const totalPatterns = patterns.length;
  const shouldShowComponent = totalPatterns > 0;

  const handleToggle = () => {
    if (!shouldShowComponent) return;
    setIsExpanded(!isExpanded);
  };

  if (!shouldShowComponent) {
    return (
      <aside className="absolute right-1 w-8 bg-green-700 rounded px-0.5 py-2 flex flex-col items-center gap-2 shadow-lg z-40">
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
      </aside>
    );
  }

  return (
    <aside
      ref={panelRef}
      onClick={handleToggle}
      className="absolute right-1 w-8 rounded flex flex-col items-center shadow-lg z-20 cursor-pointer select-none"
      style={{
        background: 'linear-gradient(180deg, #104a14 0%, #6D2028 100%)',
      }}
    >
      {/* Pattern Items Container */}
      <div
        className="flex flex-col gap-1 py-1"
        style={{
          maxHeight: isExpanded ? `${MAX_VISIBLE_ITEMS * 28}px` : 'auto',
          overflowY: isExpanded ? 'auto' : 'visible',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
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
            className="flex items-center justify-center select-none"
            style={{
              width: '23px',
              height: '24px',
            }}
          >
            <Image
              src={`/${item.winningPotImageURL}`}
              alt={`Winning Pot ${item.winningPotIndex}`}
              width={23}
              height={23}
              unoptimized
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </aside>
  );
}