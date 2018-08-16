export interface IProfile {
  username: string;
  points: number;
}

export interface IGame {
  player1: string;
  player1Uid: string;
  player1Name: string;
  player1Points: string;
  player1Ready: "false" | "true";
  player1Time: string;
  player2: string;
  player2Uid: string;
  player2Name: string;
  player2Points: string;
  player2Ready: "false" | "true";
  player2Time: string;
  timeMode: string;
  playing: "false" | "true";
  player1HasTurn: "false" | "true";
  player1Starts: "false" | "true";
  gameId: string;
}

export interface IGameOptional {
  player1?: string;
  player1Uid?: string;
  player1Name?: string;
  player1Points?: string;
  player1Ready?: "false" | "true";
  player1Time?: string;
  player2?: string;
  player2Uid?: string;
  player2Name?: string;
  player2Points?: string;
  player2Ready?: "false" | "true";
  player2Time?: string;
  timeMode?: string;
  playing?: "false" | "true";
  player1HasTurn?: "false" | "true";
  player1Starts?: "false" | "true";
  gameId?: string;
}

export const InitialGame: IGame = {
  player1: "",
  player1Uid: "",
  player1Name: "",
  player1Points: "",
  player1Ready: "false",
  player1Time: "",
  player2: "",
  player2Uid: "",
  player2Name: "",
  player2Points: "",
  player2Ready: "false",
  player2Time: "",
  timeMode: "",
  playing: "false",
  player1HasTurn: "false",
  player1Starts: "true",
  gameId: ""
};

export interface Position {
  x: number;
  y: number;
}

export interface Move {
  x: number;
  y: number;
  isPlayer1: boolean;
}
