'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useGreedyPatternResponse } from '@/lib/socket/game/greedy/greedySocketEventHandler';

interface WinningPattern {
  winningPotIndex: number;
  winningPotImageURL: string;
}

const INITIAL_VISIBLE = 5;
const MAX_VISIBLE_ITEMS = 8;

export default function RightPanel() {
  const [patterns, setPatterns] = useState<WinningPattern[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /** 🔌 Socket listener */
  useGreedyPatternResponse((response) => {
    if (response?.success && Array.isArray(response.data)) {
      setPatterns(response.data);
    }
  });

  /** 🖱️ click outside → collapse */
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  /** 📏 visible logic */
  const maxVisibleCount = isExpanded ? patterns.length : INITIAL_VISIBLE;

  const visiblePatterns = useMemo(
    () => patterns.slice(0, maxVisibleCount),
    [patterns, maxVisibleCount]
  );

  const handleToggle = () => {
    if (patterns.length === 0) return;
    setIsExpanded((prev) => !prev);
  };

  return (
    <aside
      ref={panelRef}
      onClick={handleToggle}
      className="absolute right-1 top-1/2 -translate-y-1/2
        w-14 bg-blue-500 rounded-xl px-1 py-2
        flex flex-col items-center gap-2 shadow-lg z-20 cursor-pointer"
    >
      <div className="text-white text-[10px] font-extrabold">
        Result
      </div>

      <div
        className="flex flex-col gap-1"
        style={{
          maxHeight: isExpanded ? `${MAX_VISIBLE_ITEMS * 32}px` : 'auto',
          overflowY: isExpanded ? 'auto' : 'visible',
        }}
      >
        {visiblePatterns.map((item, idx) => (
          <div
            key={`${item.winningPotIndex}-${idx}`}
            className="w-8 h-8 bg-white rounded-lg
              flex items-center justify-center shadow"
          >
            <Image
              src={`/${item.winningPotImageURL}`}
              alt={`Winning Pot ${item.winningPotIndex}`}
              width={24}
              height={24}
              className="object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </aside>
  );
}
