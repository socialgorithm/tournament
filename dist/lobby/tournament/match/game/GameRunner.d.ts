import { Game } from "./Game";
export declare type GameRunnerOptions = {
    host?: string;
    proxy?: string;
};
export declare class GameRunner {
    private matchID;
    private game;
    private gameSocket;
    private pubSub;
    constructor(matchID: string, options: GameRunnerOptions);
    start(game: Game): void;
    private onFinish;
    private onUpdate;
    private onGameToServer;
    private onPlayerToGame;
    private onGameToPlayer;
    private sendToGame;
}
