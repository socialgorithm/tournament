import IMatchmaker from "./Matchmaker";
import { Tournament } from "../Tournament";
import { MatchOptions, Match } from "../match/Match";
import { Player } from '@socialgorithm/game-server/src/constants';
export default class FreeForAllMatchmaker implements IMatchmaker {
    private players;
    private options;
    private maxMatches;
    private finished;
    private tournamentStats;
    private index;
    constructor(players: Player[], options: MatchOptions);
    isFinished(): boolean;
    updateStats(tournamentStats: Tournament): void;
    getRemainingMatches(): Match[];
    getRanking(): string[];
}
