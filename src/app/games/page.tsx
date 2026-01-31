"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import {
  Search,
  Users,
  Play,
  Lock,
  X,
  Flame,
  Star,
  Clock,
  Gamepad2,
  TrendingUp,
  Zap,
  Trophy,
  Target,
  Sparkles,
  Filter,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { env } from "process";

interface Game {
  id?: number;
  name: string;
  description?: string;
  image?: string;
  players?: string;
  badge?: string;
  category?: string;
  url: string;
  available?: boolean;
  rating?: number;
}

const games: Game[] = [
  {
    id: 16,
    name: "Teen Patti",
    description: "Classic 3-card Indian Poker",
    image: "https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=300&fit=crop",
    players: "1.2K",
    badge: "Hot",
    category: "Cards",
    url: "/games/teenpatti",
    available: true,
    rating: 4.8,
  },
  {
    id: 1,
    name: "Greedy",
    description: "Fast-paced multiplier game",
    image: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=400&h=300&fit=crop",
    players: "3.5K",
    badge: "Popular",
    category: "Crash",
    url: "/games/greedy",
    available: true,
    rating: 4.9,
  },
  {
    id: 2003,
    name: "Roulette",
    description: "Spin the wheel of fortune",
    image: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=300&fit=crop",
    players: "856",
    badge: "Soon",
    category: "Table",
    url: "/games/roulette",
    available: false,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Blackjack",
    description: "Beat the dealer to 21",
    image: "https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&h=300&fit=crop",
    players: "2.1K",
    badge: "Popular",
    category: "Cards",
    url: "/games/blackjack",
    available: false,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Slots",
    description: "Spin and win big prizes",
    image: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=300&fit=crop",
    players: "4.2K",
    badge: "Hot",
    category: "Slots",
    url: "/games/slots",
    available: false,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Poker",
    description: "Texas Hold'em tournament",
    image: "https://images.unsplash.com/photo-1609743522653-52354461eb27?w=400&h=300&fit=crop",
    players: "1.8K",
    badge: "Soon",
    category: "Cards",
    url: "/games/poker",
    available: false,
    rating: 4.9,
  },
  {
    id: 6,
    name: "Baccarat",
    description: "Player vs Banker showdown",
    image: "https://images.unsplash.com/photo-1517232115160-ff93364542dd?w=400&h=300&fit=crop",
    players: "980",
    category: "Table",
    url: "/games/baccarat",
    available: false,
    rating: 4.4,
  },
  {
    id: 7,
    name: "Dice",
    description: "Roll and predict the outcome",
    image: "https://images.unsplash.com/photo-1522069213448-443a614da9b6?w=400&h=300&fit=crop",
    players: "1.5K",
    badge: "Hot",
    category: "Crash",
    url: "/games/dice",
    available: false,
    rating: 4.5,
  },
  {
    id: 8,
    name: "Crash",
    description: "Cash out before it crashes",
    image: "https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=400&h=300&fit=crop",
    players: "2.8K",
    badge: "Popular",
    category: "Crash",
    url: "/games/crash",
    available: false,
    rating: 4.8,
  },
  {
    id: 9,
    name: "Keno",
    description: "Pick your lucky numbers",
    image: "https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=300&fit=crop",
    players: "645",
    category: "Lottery",
    url: "/games/keno",
    available: false,
    rating: 4.3,
  },
  {
    id: 10,
    name: "Plinko",
    description: "Watch the ball drop",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop",
    players: "1.1K",
    badge: "Hot",
    category: "Crash",
    url: "/games/plinko",
    available: false,
    rating: 4.7,
  },
  {
    id: 11,
    name: "Hi-Lo",
    description: "Guess higher or lower",
    image: "https://images.unsplash.com/photo-1518133683791-0b9de5a055f0?w=400&h=300&fit=crop",
    players: "890",
    category: "Cards",
    url: "/games/hilo",
    available: false,
    rating: 4.2,
  },
];

const categories = [
  { name: "All", icon: Sparkles },
  { name: "Cards", icon: Target },
  { name: "Crash", icon: Zap },
  { name: "Table", icon: Trophy },
  { name: "Slots", icon: Gamepad2 },
  { name: "Lottery", icon: Star },
];

const testGames = [
  {
    name: "Greedy Test",
    url: "https://www.wavegames.online/games/greedy?appKey=Eeb1GshW3a&gameId=1&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JpY29saXZlZS52aXAvYXBpL3NpZ24tdXAvdXNlci9zb2NpYWwtc2lnbi11cC11c2VyIiwiaWF0IjoxNzY1NjMzNTMzLCJleHAiOjE3NjgyMjU1MzMsIm5iZiI6MTc2NTYzMzUzMywianRpIjoiVkVoUUUxU1NWUWNLbklBeSIsInN1YiI6IjUwNzk3NyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.KVWQffVGZpjzS53Qj821XlxuHvjk6VLxFB9OsX14FEk",
  },
  {
    name: "Teen Patti Test",
    url: "https://www.wavegames.online/games/teenpatti?appKey=Eeb1GshW3a&gameId=16&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JpY29saXZlZS52aXAvYXBpL3NpZ24tdXAvdXNlci9zb2NpYWwtc2lnbi11cC11c2VyIiwiaWF0IjoxNzY1NjMzNTMzLCJleHAiOjE3NjgyMjU1MzMsIm5iZiI6MTc2NTYzMzUzMywianRpIjoiVkVoUUUxU1NWUWNLbklBeSIsInN1YiI6IjUwNzk3NyIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.KVWQffVGZpjzS53Qj821XlxuHvjk6VLxFB9OsX14FEk",
  },
];

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || game.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Function to handle game click and build URL with params
  const handleGameClick = (e: React.MouseEvent, gameUrl: string, gameId?: number) => {
    e.preventDefault();

    // Get params from current URL
    const params = new URLSearchParams(window.location.search);
    const appKey = params.get("appKey");
    const token = params.get("token");

    // If params don't exist, redirect to original URL
    if (!appKey || !token || !gameId) {
      window.location.href = gameUrl;
      return;
    }

    // Build URL with params
    const url = new URL(gameUrl, window.location.origin);
    url.searchParams.set("appKey", appKey);
    url.searchParams.set("gameId", gameId.toString());
    url.searchParams.set("token", token);

    // Redirect to the new URL
    window.location.href = url.pathname + url.search;
  };

  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case "Hot":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg shadow-orange-500/30";
      case "Popular":
        return "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg shadow-blue-500/30";
      case "Soon":
        return "bg-gradient-to-r from-gray-500 to-gray-700 text-white border-0 shadow-lg shadow-gray-500/30";
      default:
        return "";
    }
  };

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case "Hot":
        return <Flame className="w-3 h-3" />;
      case "Popular":
        return <Star className="w-3 h-3" />;
      case "Soon":
        return <Clock className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8366FF] via-[#7F69FF] to-[#A64EFF]">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <Gamepad2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl  text-dark font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                 Game zone
                </h1>
                <p className="text-xs text-dark hidden sm:block">Multi-Platform Gaming</p>
              </div>
            </motion.div>

            {/* Search - Desktop */}
            <div className="hidden md:flex relative flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 ml pr-2 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl backdrop-blur-sm"
              />
            </div>

            {/* Online Players */}
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
              <Users className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">12,456</span>
            </div>
          </div>

          {/* Search - Mobile */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 z-10 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Compact */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <Badge className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30">
                <Zap className="w-3 h-3 mr-1.5" />
                New Games Added
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Discover Amazing Games
              </h2>
              <p className="text-white/80 max-w-2xl">
                Choose from our collection of exciting games. Play cards, crash, slots, and more.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70 mb-0.5">Total Games</p>
                      <p className="text-xl font-bold text-white">{games.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-white/70 mb-0.5">Live Now</p>
                      <p className="text-xl font-bold text-white">
                        {games.filter((g) => g.available).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-[89px] md:top-[81px] z-30 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-white/70 shrink-0" />
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeCategory === category.name;
              return (
                <Button
                  key={category.name}
                  size="sm"
                  onClick={() => setActiveCategory(category.name)}
                  className={`whitespace-nowrap gap-1.5 no-underline hover:no-underline ${isActive
                      ? "bg-white text-[#8366FF] shadow-lg hover:bg-white/90"
                      : "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 hover:border-white/30"
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-white/80">
            Showing{" "}
            <span className="font-semibold text-white">
              {filteredGames.length}
            </span>{" "}
            games
          </p>
          <Badge className="gap-1 bg-white/20 backdrop-blur-sm text-white border border-white/30">
            <TrendingUp className="w-3 h-3" />
            Trending
          </Badge>
        </div>

        {/* Grid - 2 columns mobile, 3 columns tablet, 4 columns desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredGames.map((game) => (
            <Card
              key={game.id}
              onClick={() => {
                if (!game.available) {
                  setSelectedGame(game);
                }
              }}
              className={`group cursor-pointer overflow-hidden bg-white/10 backdrop-blur-md border-white/20 transition-all duration-300 hover:shadow-2xl hover:border-white/40 ${game.available ? "hover:-translate-y-1" : "opacity-75"
                }`}
            >
              {game.available ? (
                <Link
                  href={game.url}
                  onClick={(e) => handleGameClick(e, game.url, game.id)}
                  className="block no-underline hover:no-underline"
                >
                  <GameCardContent game={game} getBadgeStyle={getBadgeStyle} getBadgeIcon={getBadgeIcon} />
                </Link>
              ) : (
                <GameCardContent game={game} getBadgeStyle={getBadgeStyle} getBadgeIcon={getBadgeIcon} />
              )}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              No games found
            </h3>
            <p className="text-white/70 mt-1">
              Try adjusting your search or filter
            </p>
            <Button
              className="mt-4 bg-white text-[#8366FF] hover:bg-white/90 shadow-lg"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {/* Testing Area */}
        <section className="mt-12">
          <Card className="overflow-hidden bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-5 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Testing Environment
                  </h2>
                  <p className="text-sm text-white/70">
                    Development and testing builds
                  </p>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testGames.map((testGame, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/15 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                        <Gamepad2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-white font-medium">
                        {testGame.name}
                      </span>
                    </div>
                    <Button
                      asChild
                      size="sm"
                      className="bg-white text-[#8366FF] hover:bg-white/90 shadow-lg no-underline hover:no-underline"
                    >
                      <a
                        href={testGame.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 no-underline hover:no-underline"
                      >
                        Launch
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Locked Game Modal */}
      {selectedGame && !selectedGame.available && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedGame(null)}
        >
          <Card
            className="max-w-md w-full bg-white/95 backdrop-blur-xl border-white/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8366FF] to-[#A64EFF] flex items-center justify-center shadow-lg">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedGame(null)}
                  className="text-gray-500 hover:text-gray-900 -mt-1 -mr-1"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <h3 className="text-gray-900 text-xl font-bold mb-2">
                {selectedGame.name}
              </h3>
              <p className="text-gray-600 mb-6">
                This game is coming soon. We-re working hard to bring you
                the best experience. Stay tuned for updates!
              </p>
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
                  onClick={() => setSelectedGame(null)}
                >
                  Maybe Later
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-[#8366FF] to-[#A64EFF] text-white hover:from-[#7355EE] hover:to-[#953DFF] shadow-lg"
                  onClick={() => setSelectedGame(null)}
                >
                  Notify Me
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface GameCardContentProps {
  game: Game;
  getBadgeStyle: (badge?: string) => string;
  getBadgeIcon: (badge?: string) => React.ReactNode;
}

function GameCardContent({ game, getBadgeStyle, getBadgeIcon }: GameCardContentProps) {
  return (
    <>
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        <Image
          src={game.image || "/placeholder.svg"}
          alt={game.name}
          fill
          unoptimized
          className={`object-cover transition-transform duration-500 ${game.available ? "group-hover:scale-110" : "grayscale opacity-50"
            }`}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Badge */}
        {game.badge && (
          <div className="absolute top-2 left-2">
            <Badge className={`gap-1 text-xs ${getBadgeStyle(game.badge)}`}>
              {getBadgeIcon(game.badge)}
              {game.badge}
            </Badge>
          </div>
        )}

        {/* Rating */}
        {game.rating && (
          <div className="absolute top-2 right-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium text-white">
                {game.rating}
              </span>
            </div>
          </div>
        )}

        {/* Lock Icon for unavailable */}
        {!game.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        {/* Play Button on Hover */}
        {game.available && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-[#8366FF] ml-0.5" />
            </div>
          </div>
        )}

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white font-bold text-sm md:text-base truncate">
            {game.name}
          </h3>
          {game.players && (
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
              <span className="text-xs text-white/90">
                {game.players} playing
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-3">
        <p className="text-white/70 text-xs line-clamp-1 mb-2">
          {game.description}
        </p>
        <div className="flex items-center justify-between">
          <Badge className="text-xs bg-white/20 backdrop-blur-sm text-white border border-white/30">
            {game.category}
          </Badge>
          <span className={`text-xs font-medium ${game.available ? 'text-white' : 'text-white/50'}`}>
            {game.available ? "Play Now" : "Coming Soon"}
          </span>
        </div>
      </CardContent>
    </>
  );
}