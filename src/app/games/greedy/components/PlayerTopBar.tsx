//playertopbar file
import React from 'react';

export default function PlayerTopBar() {
  return (
    <button className="w-9 h-9 rounded-full overflow-hidden shadow-md bg-gradient-to-br from-[#FF8904] to-[#FF6B00] flex items-center justify-center hover:scale-105 transition-transform"   style={{ borderRadius: '50%' }}>
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full p-1"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back person */}
        <circle cx="12" cy="6" r="2.5" fill="white" opacity="0.7" />
        <path
          d="M12 9.5C9.5 9.5 7.5 11 7.5 13v2h9v-2c0-2-2-3.5-4.5-3.5z"
          fill="white"
          opacity="0.7"
        />

        {/* Left person */}
        <circle cx="7" cy="8" r="2.5" fill="white" opacity="0.85" />
        <path
          d="M7 11.5C4.5 11.5 2.5 13 2.5 15v2h9v-2c0-2-2-3.5-4.5-3.5z"
          fill="white"
          opacity="0.85"
        />

        {/* Right person */}
        <circle cx="17" cy="8" r="2.5" fill="white" />
        <path
          d="M17 11.5C14.5 11.5 12.5 13 12.5 15v2h9v-2c0-2-2-3.5-4.5-3.5z"
          fill="white"
        />
      </svg>
    </button>
  );
}
