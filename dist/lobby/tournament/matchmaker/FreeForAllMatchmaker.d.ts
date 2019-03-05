import { Player } from "@socialgorithm/game-server/src/constants";
import { Match, MatchOptions } from "../match/Match";
import IMatchmaker from "./Matchmaker";
export default class FreeForAllMatchmaker implements IMatchmaker {
    private players;
    private options;
    private maxMatches;
    private finished;
    private allMatches;
    private index;
    constructor(players: Player[], options: MatchOptions);
    isFinished(): boolean;
    updateStats(allMatches: Match[]): void;
    getRemainingMatches(): Match[];
    getRanking(): string[];
}
