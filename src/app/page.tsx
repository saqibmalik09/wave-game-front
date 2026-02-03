'use client';

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center space-y-6 max-w-2xl px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span>Next-Gen Gaming Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Wave Games
        </h1>

        <p className="text-lg text-zinc-400 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
          Experience the future of gaming management. Monitor, analyze, and control your gaming ecosystem from one central hub.
        </p>

        <div className="pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-zinc-200 transition-colors hover:scale-105 active:scale-95 duration-200 shadow-xl shadow-white/5"
          >
            Access Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 text-zinc-600 text-sm">
        © 2026 Wave Games. All rights reserved.
      </div>
    </div>
  );
}