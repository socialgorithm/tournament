import { Game } from "@socialgorithm/model";
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
    private create;
    private onCreate;
    private onFinish;
    private onUpdate;
}
