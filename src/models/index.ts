export interface IProfile {
  username: string;
  points: number;
}

export interface IGame {
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
  timeMode: number;
  playing: boolean;
  player1HasTurn: boolean;
  player1Starts: boolean;
  gameId: string;
}

export interface IGameOptional {
  player1?: string;
  player1Uid?: string;
  player1Name?: string;
  player1Points?: number;
  player1Ready?: boolean;
  player1Time?: number;
  player2?: string;
  player2Uid?: string;
  player2Name?: string;
  player2Points?: number;
  player2Ready?: boolean;
  player2Time?: number;
  timeMode?: number;
  playing?: boolean;
  player1HasTurn?: boolean;
  player1Starts?: boolean;
  gameId?: string;
}

export const InitialGame: IGame = {
  player1: "",
  player1Uid: "",
  player1Name: "",
  player1Points: 1500,
  player1Ready: false,
  player1Time: null,
  player2: "",
  player2Uid: "",
  player2Name: "",
  player2Points: 1500,
  player2Ready: false,
  player2Time: null,
  timeMode: null,
  playing: false,
  player1HasTurn: false,
  player1Starts: true,
  gameId: ""
};

export interface IPosition {
  x: number;
  y: number;
}

export interface IMove {
  x: number;
  y: number;
  isPlayer1: boolean;
}
