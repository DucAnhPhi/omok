export interface IProfile {
  username: string;
  points: number;
  win: number;
  lose: number;
  draw: number;
}

export interface IGame {
  boardPositions: any[][];
  playerIds: string[];
  available: boolean;
  playerWhite: string;
  isWhiteTurn: boolean;
  winner: string;
}
