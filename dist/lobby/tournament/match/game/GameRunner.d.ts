import { Game } from "./Game";
export declare type GameRunnerOptions = {
    host?: string;
    proxy?: string;
};
export declare class GameRunner {
    game: Game;
    gameSocket: any;
    constructor(options: GameRunnerOptions);
    start(): void;
    private onFinish;
    private onUpdate;
    private onGameToServer;
    private onPlayerToGame;
    private onGameToPlayer;
    private sendToGame;
}
