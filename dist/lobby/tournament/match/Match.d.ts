import { Player } from "@socialgorithm/game-server/src/constants";
import { Game } from "./game/Game";
export declare type Match = {
    matchID: string;
    options: MatchOptions;
    players: Player[];
    games: Game[];
    state: "playing" | "finished" | "upcoming";
    winner: number;
};
export declare type MatchOptions = {
    maxGames: number;
    timeout: number;
    autoPlay: boolean;
};
