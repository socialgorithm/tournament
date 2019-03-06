import { Player } from "@socialgorithm/game-server/dist/constants";
import { Game } from "./game/Game";
export declare type Match = {
    matchID: string;
    options: MatchOptions;
    players: Player[];
    games: Game[];
    state: "playing" | "finished" | "upcoming";
    winner: number;
    stats: MatchStats;
};
export declare type MatchStats = {
    gamesCompleted: number;
    gamesTied: number;
    wins: number[];
    times: number[];
    timeouts: number[];
    state: "playing" | "finished" | "upcoming";
    winner: number;
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
export declare type MatchOptions = {
    maxGames: number;
    timeout: number;
    autoPlay: boolean;
};
export declare const INITIAL_STATS: MatchStats;
