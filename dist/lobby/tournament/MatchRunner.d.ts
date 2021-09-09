import { GameServerAddress, Match } from "@socialgorithm/model";
export declare class MatchRunner {
    private match;
    private tournamentID;
    private gameServerAddress;
    private pubSub;
    private gameServerSocket;
    private playerTokens;
    constructor(match: Match, tournamentID: string, gameServerAddress: GameServerAddress);
    private sendMatchToGameServer;
    private onMatchCreated;
    private sendGameServerHandoffToPlayers;
    private onGameEnded;
    private onMatchEnded;
    private updateMatchStats;
    private convertPlayerTokenToPlayerName;
}
