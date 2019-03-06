import { Player } from "@socialgorithm/game-server/dist/constants";

export type Game = {
    gameID: string,
    players: Player[],
    stats: any, // per game stats, defined by the game server
    winner: Player | null,
    tie: boolean,
    duration: number,
    message: string, // optional message for the UI
};
