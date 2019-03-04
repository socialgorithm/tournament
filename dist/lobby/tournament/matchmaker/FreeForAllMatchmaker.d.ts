import { Player } from "@socialgorithm/game-server/src/constants";
import { Match, MatchOptions } from "../match/Match";
import { Tournament } from "../Tournament";
import IMatchmaker from "./Matchmaker";
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
