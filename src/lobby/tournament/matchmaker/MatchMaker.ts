import { Match } from "../lobby/tournament/match/MatchRunner";
import { Tournament } from "../lobby/tournament/TournamentRunner";
import { Player } from "../Player";

/**
 * MatchMaker defines a strategy for matching players.
 * 
 * It is responsible to produce new matches until it considers that there is a winner
 * according to the strategy followed.
 */
export default interface IMatchMaker {
    isFinished(): Boolean,
    updateStats(tournament: Tournament): Match[],
    getRemainingMatches(tournament: Tournament): Match[],
    getRanking(tournament: Tournament): Player[],
}