import { Game } from "./game/Game";
import { Player } from "@socialgorithm/game-server/src/constants";
export declare type Match = {
    matchID: string;
    players: Player[];
    games: Game[];
    state: 'playing' | 'finished' | 'upcoming';
};
export declare type MatchOptions = {
    maxGames: number;
    timeout: number;
    autoPlay: boolean;
};
