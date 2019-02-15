import IMatchmaker from "./Matchmaker";
import { Tournament } from "../Tournament";
import { DoubleEliminationMatch } from "./DoubleEliminationMatch";
import { MatchOptions } from "../match/Match";
import { Player } from "@socialgorithm/game-server/src/constants";
export default class DoubleEliminationMatchmaker implements IMatchmaker {
    private players;
    private options;
    private finished;
    private tournament;
    private ranking;
    private processedMatches;
    private playerStats;
    private zeroLossOddPlayer;
    private oneLossOddPlayer;
    private waitingForFinal;
    private unlinkedMatches;
    constructor(players: Player[], options: MatchOptions);
    isFinished(): boolean;
    updateStats(tournament: Tournament): void;
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