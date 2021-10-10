import { Match, Player, PlayerRank } from "@socialgorithm/model";

/**
 * MatchMaker defines a strategy for matching players.
 *
 * It is responsible to produce new matches until it considers that there is a winner
 * according to the strategy followed.
 */
export default interface IMatchMaker {
    isFinished(): boolean;
    updateUIStats(match: Match): void;
    updateStats(allMatches: Match[], tournamentFinished?: boolean): Match[] | void;
    getRemainingMatches(): Match[];
    getRanking(): PlayerRank[];
}
