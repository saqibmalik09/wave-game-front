'use client';
import React, { useState } from "react";
import { getCache, setCache } from "@/lib/cache";
import { gameConfiguration } from "@/lib/socket/socketEventHandlers";
import { useRouter } from "next/navigation";

const APP_NAME = "WaveGames";

const games = [
  {
    id: 16,
    name: "Teen Patti",
    description: "Classic 3-card Indian Poker",
    image: "https://5.imimg.com/data5/SELLER/Default/2022/9/RF/FR/CZ/675237/teen-patti-gold-game-app-500x500.png",
    players: "1.2K",
    badge: "Hot",
    url: "/games/teenpatti",
    available: true,
  },
  {
    id: 2003,
    name: "Roulette",
    description: "Spin the wheel of fortune",
    image: "https://images.unsplash.com/photo-1607483659346-bf5f0b15633d?auto=format&fit=crop&w=800&q=80",
    players: "856",
    badge: "Soon",
    url: "/games/roulette",
    available: false,
  },
  {
    id: 77,
    name: "Blackjack",
    description: "Beat the dealer with 21",
    image: "https://images.unsplash.com/photo-1604908177520-22c0dce1781f?auto=format&fit=crop&w=800&q=80",
    players: "2.4K",
    badge: "Soon",
    url: "/games/blackjack",
    available: false,
  },
];

export default function GamesList() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [appKey, setAppKey] = useState("");
  const [token, setToken] = useState("");

  const handlePlay = (game: any) => {
    if (!game.available) return;
    setSelectedGame(game);
    setAppKey("");
    setToken("");
  };
a
  const handleSubmit = () => {
    if (!appKey || !token) {
      alert("Please enter both AppKey and Token.");
      return;
    }

    if (!selectedGame) return;

    gameConfiguration(selectedGame.id, (config) => {
      const cacheKey = `game_config_${selectedGame.id}`;
      const cached = getCache(cacheKey);
      if (!cached) setCache(cacheKey, config);

      const urlWithParams = `${selectedGame.url}?appKey=${encodeURIComponent(appKey)}&gameId=${selectedGame.id}&token=${encodeURIComponent(token)}`;
      router.push(urlWithParams);
      setSelectedGame(null);
    });
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
      </div>

      {/* Floating Orbs */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="fixed top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12 md:mb-16">
          <div className="inline-block mb-4">
            <div className="relative">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent tracking-tight relative z-10">
                {APP_NAME}
              </h1>
              <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-30 -z-10"></div>
            </div>
          </div>
          <p className="text-base md:text-lg text-slate-400 font-light tracking-wider">
            Play • Win • Repeat
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-500">Live Players: <span className="text-emerald-400 font-semibold">4.5K</span></span>
          </div>
        </header>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {games.map((game, idx) => (
            <div
              key={game.id}
              onClick={() => handlePlay(game)}
              className={`group relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden border transition-all duration-500 animate-fadeInUp ${
                game.available 
                  ? 'border-slate-700/50 hover:border-cyan-500/70 hover:shadow-2xl hover:shadow-cyan-500/25 hover:-translate-y-2 cursor-pointer' 
                  : 'border-slate-800/30 opacity-60 cursor-not-allowed'
              }`}
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              {/* Badge */}
              <div className={`absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xl backdrop-blur-sm ${
                game.available 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                  : 'bg-slate-700/80 text-slate-300'
              }`}>
                {game.badge}
              </div>

              {!game.available && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🔒</div>
                    <p className="text-xl font-bold text-slate-300">Coming Soon</p>
                    <p className="text-xs text-slate-500 mt-1">Stay tuned!</p>
                  </div>
                </div>
              )}

              {/* Image Container */}
              <div className="relative h-48 md:h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
                <img 
                  src={game.image} 
                  alt={game.name} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Glow Effect */}
                {game.available && (
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent"></div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                  {game.name}
                </h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                  {game.description}
                </p>
                
                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${game.available ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></div>
                    <span className="text-xs text-slate-500">
                      {game.available ? `${game.players} playing` : 'Locked'}
                    </span>
                  </div>
                  
                  {game.available && (
                    <div className="flex items-center gap-1 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-sm font-semibold">Play Now</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Shimmer Effect on Hover */}
              {game.available && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shimmer"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 text-sm">
            More games coming soon! Stay tuned for updates.
          </p>
        </div>
      </div>

      {/* Modal */}
      {selectedGame && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-slate-900 rounded-xl p-6 w-80 max-w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-white text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-white font-bold text-lg mb-4 text-center">{selectedGame.name}</h2>

            <div className="mb-3">
              <label className="block text-white text-sm mb-1">AppKey</label>
              <input
                type="text"
                value={appKey}
                onChange={(e) => setAppKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm mb-1">Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 rounded-lg font-semibold"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, -30px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-30px, 30px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }

        .shimmer {
          animation: shimmer 2s ease-in-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}