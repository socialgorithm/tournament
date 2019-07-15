import { Match } from "@socialgorithm/model";
export declare class MatchRunner {
    private match;
    private tournamentID;
    private gameServerAddress;
    private pubSub;
    private gameServerSocket;
    constructor(match: Match, tournamentID: string, gameServerAddress: string);
    private sendMatchToGameServer;
    private onMatchCreated;
    private onGameEnded;
    private onMatchEnded;
    private updateMatchStats;
}
