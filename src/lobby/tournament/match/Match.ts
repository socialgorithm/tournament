import { Player } from "@socialgorithm/game-server/src/constants";
import { Game } from "./game/Game";

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
    wins: number[]; // Array with only two elements, 0 is wins by player 0, 1 is wins by player 1
    times: number[]; // Array with the times for all the games
    timeouts: number[]; // Array for all timeouts
    state: "playing" | "finished" | "upcoming";
    winner: number; // The index (in players) of the winner of the match
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

export const INITIAL_STATS: MatchStats = {
    gamesCompleted: 0,
    gamesTied: 0,
    wins: [],
    times: [],
    timeouts: [],
    state: "upcoming",
    winner: -1,
};
