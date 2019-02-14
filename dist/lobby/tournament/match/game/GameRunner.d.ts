import { Game } from "./Game";
import PubSub from '../../../../lib/PubSub';
export declare type GameRunnerOptions = {
    host?: string;
    proxy?: string;
};
export declare class GameRunner {
    game: Game;
    gameSocket: any;
    pubsub: PubSub;
    constructor(options: GameRunnerOptions);
    start(): void;
    onGameEnd(): void;
    private onFinish;
    private onUpdate;
    private onGameToServer;
    private onPlayerToGame;
    private onGameToPlayer;
    private sendToGame;
}
