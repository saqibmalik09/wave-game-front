import { useEffect, useState } from 'react';

export default function LoadingGame() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 600);

    return () => clearInterval(dotsInterval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4">
      <div className="flex flex-col items-center space-y-8 md:space-y-12 max-w-md w-full">
        {/* Main Loading Icon */}
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-8 border-indigo-500/30 rounded-full"></div>
          
          {/* Spinning Ring */}
          <div 
            className="absolute inset-0 border-8 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full"
            style={{ animation: 'spin 3s linear infinite' }}
          ></div>
          
          {/* Middle Ring */}
          <div 
            className="absolute inset-3 border-6 border-transparent border-t-purple-400 border-l-pink-400 rounded-full"
            style={{ animation: 'spin 4s linear infinite reverse' }}
          ></div>
          
          {/* Inner Circle */}
          <div className="absolute inset-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <div 
              className="text-4xl md:text-5xl"
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            >
              🎮
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-3 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Loading Game{dots}
          </h1>
          <p className="text-gray-400 text-sm md:text-base lg:text-lg">
            Initializing game environment
          </p>
        </div>

        {/* Animated Dots */}
        <div className="flex space-x-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-indigo-500"
              style={{
                animation: 'dotWave 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Bottom Glow Effect */}
        <div className="relative w-full h-1 bg-gray-800/50 rounded-full overflow-hidden">
          <div 
            className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full"
            style={{ animation: 'slideGlow 2s ease-in-out infinite' }}
          ></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes dotWave {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-12px);
            opacity: 1;
          }
        }

        @keyframes slideGlow {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}