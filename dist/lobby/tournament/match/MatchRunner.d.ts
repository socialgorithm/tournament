import { Match } from "./Match";
export declare class MatchRunner {
    private match;
    private tournamentID;
    private gameServerAddress;
    private pubSub;
    private gameRunner;
    constructor(match: Match, tournamentID: string, gameServerAddress: string);
    onEnd(): void;
    private playNextGame;
    private onGameEnd;
    private onMatchEnd;
    private updateMatchStats;
    private sendStats;
}
