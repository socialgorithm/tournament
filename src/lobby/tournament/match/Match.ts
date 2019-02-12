import { Game } from "./game/Game";

export type Match = {
    matchID: string,
    games: Game[],
    state: 'playing' | 'finished' | 'upcoming',
};