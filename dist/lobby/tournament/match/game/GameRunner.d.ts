import { Player } from "../../../Player";
import { Game } from "./Game";
export declare type GameUpdatePayload = {
    stats: any;
};
export declare type GameEndPayload = {
    winner: Player | null;
    tie: boolean;
    duration: number;
    stats: any;
    message: string;
};
export declare type GameMessage = {
    type: 'UPDATE' | 'END';
    payload: any;
};
export declare class GameRunner {
    game: Game;
    gameSocket: any;
    start(): void;
    private onFinish;
    private onUpdate;
    private onGameToServer;
    private onPlayerToGame;
    private onGameToPlayer;
    private sendToGame;
}
