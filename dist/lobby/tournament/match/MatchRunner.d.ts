import { Match } from "./Match";
export declare class MatchRunner {
    private match;
    private tournamentID;
    private pubSub;
    constructor(match: Match, tournamentID: string);
    start(): void;
    private playNextGame;
    private onGameEnd;
    private onMatchEnd;
    private updateMatchStats;
    private sendStats;
}
