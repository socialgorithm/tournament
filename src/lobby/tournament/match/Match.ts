import { Game } from "./game/Game";
import { Player } from "../../Player";

export type Match = {
    matchID: string,
    players: Player[],
    games: Game[],
    state: 'playing' | 'finished' | 'upcoming',
};

export type MatchOptions = {
    maxGames: number,
    timeout: number,
    autoPlay: boolean,
};