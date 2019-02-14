import { Player } from "@socialgorithm/game-server/src/constants";
export declare type Game = {
    gameID: string;
    players: Player[];
    stats: any;
    winner: Player | null;
    tie: boolean;
    duration: number;
    message: string;
};
