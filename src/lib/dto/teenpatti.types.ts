// src/lib/types/teenpatti.types.ts

export interface GameConfig {
  gameId: number;
  bettingCoins: number[];
  cardImages: string[][];
  cardBackImages: string[][];
  dealerAvatar: string;
  tableBackgroundImage: string;
  betButtonAndCardClickSound: string;
  timerUpSound: string;
  cardsShuffleSound: string;
  returnWinngingPotPercentage: number[];
  colors: string[];
  winningCalculationTime: number;
  BettingTime: number;
  nextBetWait: number;
}

export interface PotData {
  potName: string;
  betCoins: number[];
  totalBetAmount: number;
}

export interface UserData {
  userId: string;
  name: string;
  imageProfile: string;
  balance?: number;
}

export interface WinnerData {
  userId: string;
  amountWon: number;
  gameId: number;
  imageProfile: string;
}

export interface GameResult {
  winners: WinnerData[];
  winningPot: string;
  winningCards: string[];
  winningPotRankText: string;
}

export interface TimerData {
  phase: 'bettingTimer' | 'winningCalculationTimer' | 'resultAnnounceTimer' | 'newGameStartTimer';
  remaining: number;
  message?: string;
}

export interface BetPayload {
  userId: string;
  amount: number;
  tableId: string;
  betType: string;
}

export interface BetResponse {
  success: boolean;
  message: string;
  data: {
    betId: string;
    userId: string;
    amount: number;
    tableId: string;
    game: string;
    timestamp: number;
    status: string;
    newBalance?: number;
  };
}

export interface PotBetsAndUsersData {
  pots: PotData[];
  users: UserData[];
}

export interface CoinSprite {
  id: string;
  amount: number;
  x: number;
  y: number;
  sprite?: any;
}

export type GamePhase = 'betting' | 'calculation' | 'result' | 'waiting';