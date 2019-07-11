import { Player } from "@socialgorithm/game-server";
import { Match } from "@socialgorithm/model";

/**
 * MatchMaker defines a strategy for matching players.
 *
 * It is responsible to produce new matches until it considers that there is a winner
 * according to the strategy followed.
 */
export default interface IMatchMaker {
    isFinished(): boolean;
    updateStats(allMatches: Match[], tournamentFinished?: boolean): Match[] | void;
    getRemainingMatches(): Match[];
    getRanking(): Player[];
}
