import { Game } from "./Game";
export declare type GameRunnerOptions = {
    gameServerAddress: string;
};
export declare class GameRunner {
    private matchID;
    private game;
    private options;
    private gameSocket;
    private pubSub;
    constructor(matchID: string, game: Game, options: GameRunnerOptions);
    close(): void;
    private start;
    private onStart;
    private onFinish;
    private onUpdate;
}
