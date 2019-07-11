import { Player } from "@socialgorithm/game-server";
import { Match, MatchOptions } from "@socialgorithm/model";
import IMatchmaker from "./Matchmaker";
export default class FreeForAllMatchmaker implements IMatchmaker {
    private players;
    private options;
    private matches;
    constructor(players: Player[], options: MatchOptions);
    isFinished(): boolean;
    updateStats(allMatches: Match[], tournamentFinished?: boolean): void;
    getRemainingMatches(): Match[];
    getRanking(): string[];
    private playersAlreadyMatched;
}
