export interface IProfile {
  username: string;
  points: number;
}

export interface IGame {
  gameId: string;
  player1: string;
  player1Uid: string;
  player1Name: string;
  player1Points: number;
  player1Ready: boolean;
  player1Time: number;
  player2: string;
  player2Uid: string;
  player2Name: string;
  player2Points: number;
  player2Ready: boolean;
  player2Time: number;
  playing: boolean;
  timeMode: number;
  turn: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Move {
  x: number;
  y: number;
  isPlayer1: boolean;
}
