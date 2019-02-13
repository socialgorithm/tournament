import { Game } from "./game/Game";
import { Player } from "../../Player";
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
