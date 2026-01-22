// games.dto.ts

export interface UserData {
  id: string;
  name: string;
  balance: number;
  profilePicture: string;
}

export interface GameUserInfoResponse {
  success: boolean;
  message: string;
  data: UserData;
}

export interface TenantDataResponse {
  success: boolean;
  message: string;
  data: {
    activeGames: string;
    tanantName: string;
    tenantAppKey: string;
    tenantProductionDomain: string;
    tenantTestingDomain: string;
    tenantPassword: string;
  };
}

export interface UserInfoType {
  appKey: string;
  token: string;
  gameId: string;
}

export interface GameConfig {
  colors: string[];
  gameId: number;
  cardImages: string[][];
  BettingTime: number;
  nextBetWait: number;
  bettingCoins: number[];
  dealerAvatar: string;
  timerUpSound: string;
  cardBackImages: string[][];
  cardsShuffleSound: string;
  tableBackgroundImage: string;
  winningCalculationTime: number;
  betButtonAndCardClickSound: string;
  returnWinngingPotPercentage: number[];
}
