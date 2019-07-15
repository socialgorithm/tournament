
import { Game } from "./Game";
import { Player } from "./Player";

export type Match = {
  matchID: string,
  options: MatchOptions
  players: Player[],
  games: Game[],
  state: "playing" | "finished" | "upcoming",
  winner: number,
  stats: MatchStats,
};

export type MatchStats = {
  gamesCompleted: number; // Number of games won
  gamesTied: number; // Number of ties
  wins: number[]; // Array with as many elements as players, index 0 is wins by player 0 and so on
  // times: number[]; // Array with the times for all the games
  // timeouts: number[]; // Array for all timeouts
};

export interface IStats {
  winner?: number;
  total?: number;
  max?: number;
  avg?: number;
  min?: number;
  winPercentages?: string[];
  tiePercentage?: string;
}

export type MatchOptions = {
  maxGames: number,
  timeout: number,
  autoPlay: boolean,
};
