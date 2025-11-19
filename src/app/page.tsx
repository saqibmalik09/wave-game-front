"use client";

import React, { useEffect, useState } from "react";
import { getCache, setCache } from "@/lib/cache";
import { gameConfiguration } from "@/lib/socket/socketEventHandlers";
import { url } from "inspector";
import { useRouter } from "next/navigation";

const APP_NAME = "WaveGames";

const games = [
  {
    id: 16,
    name: "Teen Patti",
    description: "Classic 3-card Indian Poker",
    image: "https://cdn.hub88.io/onetouchlive/bg/ont_teenpatti20-20.jpg",
    players: "1.2K",
    badge: "Hot",
    url: "/games/teenpatti",
  },
  {
    id: 2003,
    name: "Roulette",
    description: "Spin the wheel of fortune",
    image: "https://images.unsplash.com/photo-1607483659346-bf5f0b15633d?auto=format&fit=crop&w=800&q=80",
    players: "856",
    badge: "Live",
    url: "/games/roulette",
  },
  {
    id: 77,
    name: "Blackjack",
    description: "Beat the dealer with 21",
    image: "https://images.unsplash.com/photo-1604908177520-22c0dce1781f?auto=format&fit=crop&w=800&q=80",
    players: "2.4K",
    badge: "Popular",
    url: "/games/blackjack",
  },
];

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const router = useRouter();

  // 🟦 When user clicks a game
  const handlePlay = (game: any) => {

     gameConfiguration(game.id, (config) => {
       const cacheKey = `game_config_${game.id}`;
        const cached = getCache(cacheKey);
      if (cached) {
        setSelectedGame(game);
        router.push(game.url);
        return;
      }else
      {
        return;
      }
  
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative">
      {/* Subtle grid pattern overlay */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB...')] opacity-40"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
            {APP_NAME}
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-light">
            Play • Win • Repeat
          </p>
        </header>

        {/* Games Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {games.map((game, idx) => (
            <div
              key={game.id}
              onClick={() => handlePlay(game)}   // <-- HERE
              className="group relative bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800/50 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 cursor-pointer animate-fadeInUp"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Badge */}
              <div className="absolute top-2 right-2 z-20 px-2 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white text-xs font-bold shadow-lg">
                {game.badge}
              </div>

              {/* Image Section */}
              <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent z-10"></div>
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Play button on hover */}
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/95 flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-slate-900 ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 md:p-4">
                <h3 className="text-base md:text-lg font-bold text-white mb-1 truncate group-hover:text-cyan-400 transition-colors">
                  {game.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span>{game.players} playing</span>
                  </div>
                  <button className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-200 opacity-0 group-hover:opacity-100 text-xs">
                    Play
                  </button>
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-8 md:mt-12 text-center">
          <div className="inline-flex items-center gap-3 text-slate-600 text-xs md:text-sm">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-slate-700"></span>
            <span>🔒 Secure</span>
            <span>•</span>
            <span>⚡ Fast</span>
            <span>•</span>
            <span>🎮 Fair Play</span>
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-slate-700"></span>
          </div>
        </footer>
      </div>
    </div>
  );
}
