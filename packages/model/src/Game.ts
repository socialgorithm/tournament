import { Player } from "./Player";

export type Game = {
    duration: number,
    players: Player[],
    stats: any, // per game stats, defined by the game server
    tie: boolean,
    winner: Player | null,
};
