import { Match, MatchOptions, Player } from "@socialgorithm/model";
import { DoubleEliminationMatch } from "./DoubleEliminationMatch";
import IMatchmaker from "./Matchmaker";
export default class DoubleEliminationMatchmaker implements IMatchmaker {
    private players;
    private options;
    private finished;
    private playedMatches;
    private ranking;
    private processedMatches;
    private playerStats;
    private zeroLossOddPlayer;
    private oneLossOddPlayer;
    private waitingForFinal;
    private unlinkedMatches;
    constructor(players: Player[], options: MatchOptions);
    isFinished(): boolean;
    updateStats(playedMatches: Match[], tournamentFinished?: boolean): void;
    getRemainingMatches(): DoubleEliminationMatch[];
    getRanking(): string[];
    private finishedRanking;
    private unfinishedRanking;
    private getPlayerScore;
    private matchPlayers;
    private createMatch;
    private playerIsWaitingForMatch;
    private anyPlayersWaiting;
    private setParentMatches;
}