// 'use client';
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// const games = [
//   {
//     id: 16,
//     name: "Teen Patti",
//     description: "Classic 3-card Indian Poker",
//     image: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=300&fit=crop",
//     players: "1.2K",
//     badge: "Hot",
//     url: "/games/teenpatti",
//     available: true,
//   },
//   {
//     id: 1,
//     name: "Greedy",
//     description: "Fast-paced multiplier game",
//     image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=400&h=300&fit=crop",
//     players: "3.5K",
//     badge: "Popular",
//     url: "/games/greedy",
//     available: true,
//   },
//   {
//     id: 2003,
//     name: "Roulette",
//     description: "Spin the wheel of fortune",
//     image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop",
//     players: "856",
//     badge: "Soon",
//     url: "/games/roulette",
//     available: false,
//   },
//   {
//     id: 77,
//     name: "Blackjack",
//     description: "Beat the dealer with 21",
//     image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop",
//     players: "2.4K",
//     badge: "Soon",
//     url: "/games/blackjack",
//     available: false,
//   },
//   {
//     id: 45,
//     name: "Poker",
//     description: "Texas Hold'em style poker",
//     image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop",
//     players: "1.8K",
//     badge: "New",
//     url: "/games/poker",
//     available: true,
//   },
//   {
//     id: 88,
//     name: "Baccarat",
//     description: "Elegant card betting game",
//     image: "https://images.unsplash.com/photo-1541333991892-9e6e76c6bf70?w=400&h=300&fit=crop",
//     players: "945",
//     badge: "Soon",
//     url: "/games/baccarat",
//     available: false,
//   },
// ];

// const testGames = [
//   {
//     name: "Greedy Test",
//     url: "https://wavegames.online/games/greedy?appKey=Eeb1GshW3a&gameId=1&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JpY29saXZlZS52aXAvYXBpL3NpZ24tdXAvdXNlci9zb2NpYWwtc2lnbi11cC11c2VyIiwiaWF0IjoxNzY1NjMzNTMzLCJleHAiOjE3NjgyMjU1MzMsIm5iZiI6MTc2NTYzMzUzMywianRpIjoiVkVoUUUxU1NWUWNLbklBeSIsInN1YiI6IjUwNzk3NyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.KVWQffVGZpjzS53Qj821XlxuHvjk6VLxFB9OsX14FEk"
//   },
//   {
//     name: "Teen Patti Test",
//     url: "https://wavegames.online/games/teenpatti?appKey=Eeb1GshW3a&gameId=16&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JpY29saXZlZS52aXAvYXBpL3NpZ24tdXAvdXNlci9zb2NpYWwtc2lnbi11cC11c2VyIiwiaWF0IjoxNzY1NjMzNTMzLCJleHAiOjE3NjgyMjU1MzMsIm5iZiI6MTc2NTYzMzUzMywianRpIjoiVkVoUUUxU1NWUWNLbklBeSIsInN1YiI6IjUwNzk3NyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.KVWQffVGZpjzS53Qj821XlxuHvjk6VLxFB9OsX14FEk"
//   }
// ];

// export default function Home() {
//   const router = useRouter();
//   const [selectedGame, setSelectedGame] = useState(null);

//   const handleGameClick = (game) => {
//     if (game.available) {
//       router.push(game.url);
//     } else {
//       setSelectedGame(game);
//     }
//   };

//   const getBadgeColor = (badge) => {
//     switch (badge) {
//       case "Hot":
//         return "bg-gradient-to-r from-red-500 to-orange-500";
//       case "Popular":
//         return "bg-gradient-to-r from-purple-500 to-pink-500";
//       case "New":
//         return "bg-gradient-to-r from-green-500 to-emerald-500";
//       case "Soon":
//         return "bg-gradient-to-r from-gray-500 to-slate-500";
//       default:
//         return "bg-blue-500";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       {/* Header */}
//       <div className="bg-black/30 backdrop-blur-md border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <h1 className="text-3xl sm:text-4xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
//             🎮 Game Hub
//           </h1>
//           <p className="text-gray-400 mt-2">Choose your game and start playing!</p>
//         </div>
//       </div>

//       {/* Games Grid */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
//           {games.map((game) => (
//             <div
//               key={game.id}
//               onClick={() => handleGameClick(game)}
//               className={`group relative bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300 ${
//                 game.available
//                   ? "cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
//                   : "cursor-not-allowed opacity-75"
//               }`}
//             >
//               {/* Game Image */}
//               <div className="relative aspect-[4/3] overflow-hidden">
//                 <img
//                   src={game.image}
//                   alt={game.name}
//                   className={`w-full h-full object-cover transition-transform duration-300 ${
//                     game.available ? "group-hover:scale-110" : "grayscale"
//                   }`}
//                 />
                
//                 {/* Badge */}
//                 <div className={`absolute top-2 right-2 ${getBadgeColor(game.badge)} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg`}>
//                   {game.badge}
//                 </div>

//                 {/* Lock Overlay */}
//                 {!game.available && (
//                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
//                     <div className="text-center">
//                       <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-white/80" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                       </svg>
//                       <p className="text-white text-xs sm:text-sm font-semibold">Coming Soon</p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Play Button Overlay (for available games) */}
//                 {game.available && (
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                     <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 sm:p-4 border-2 border-white/40">
//                       <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
//                         <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
//                       </svg>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Game Info */}
//               <div className="p-2 sm:p-3 lg:p-4">
//                 <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg truncate">{game.name}</h3>
//                 <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-1 sm:line-clamp-2">{game.description}</p>
                
//                 {/* Players Count */}
//                 <div className="flex items-center mt-2 sm:mt-3 text-xs sm:text-sm">
//                   <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
//                   </svg>
//                   <span className="text-green-400 font-semibold">{game.players}</span>
//                   <span className="text-gray-500 ml-1">playing</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Testing Area */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
//         <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-6">
//           <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
//             <svg className="w-6 h-6 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             Testing Area
//           </h2>
//           <p className="text-gray-400 mb-6">Test game integrations with live tokens</p>
          
// {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//   {testGames.map((testGame, index) => (
//     <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition-all">
//       <div className="flex items-center justify-between mb-3">
//         <h3 className="text-white font-semibold flex items-center">
//           <span className="bg-purple-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center mr-2">
//             {index + 1}
//           </span>
//           {testGame.name}
//         </h3>
//       </div>
      
//         href={testGame.url}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-all shadow-lg hover:shadow-purple-500/50" >
//         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//         </svg>
//         Launch Test
//       </a>
//     </div>
//   ))}
// </div> */}

//       {/* Locked Game Modal */}
//       {selectedGame && !selectedGame.available && (
//         <div
//           className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
//           onClick={() => setSelectedGame(null)}
//         >
//           <div
//             className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/20 shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="text-center">
//               <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-white mb-2">{selectedGame.name}</h3>
//               <p className="text-gray-400 mb-6">{selectedGame.description}</p>
//               <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
//                 <p className="text-yellow-400 font-semibold">🚀 Coming Soon!</p>
//                 <p className="text-gray-400 text-sm mt-1">This game is currently under development</p>
//               </div>
//               <button
//                 onClick={() => setSelectedGame(null)}
//                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg"
//               >
//                 Got it!
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
