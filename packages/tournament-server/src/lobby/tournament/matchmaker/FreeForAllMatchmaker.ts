import { v4 as uuid } from "uuid";

import { Match, MatchOptions, Player, PlayerRank } from "@socialgorithm/model";
import IMatchmaker from "./MatchMaker";

type PlayerStats = {
  player: Player;
  realtimeWins: number;
  realtimeLosses: number;
};

const RESULT_TIE = -1;

/**
 * FreeForAll is a strategy where only one round is played, in which every player
 * plays against every other player in the tournament.
 *
 * The winner will be the player that has won the most games.
 *
 */
export default class FreeForAllMatchmaker implements IMatchmaker {

  private matches: Match[];
  private playerStats: { [key: string]: PlayerStats };

  constructor(private players: Player[], private options: MatchOptions) {
    this.matches = [];

    this.playerStats = {};
    this.players.forEach(player => {
      this.playerStats[player] = { player, realtimeWins: 0, realtimeLosses: 0 };
    });

    this.players.forEach(playerA => {
      this.players.forEach(playerB => {
        if (playerA !== playerB && !this.playersAlreadyMatched(playerA, playerB)) {
          this.matches.push({
            games: [],
            matchID: uuid(),
            messages: [],
            options: this.options,
            players: [playerA, playerB],
            state: "upcoming",
            winner: -1,
            stats: {
              gamesCompleted: 0,
              gamesTied: 0,
              wins: [],
            },
          });
        }
      });
    });
  }

  public isFinished(): boolean {
    return this.getRemainingMatches().length === 0;
  }

  public updateRealtimeStats(match: Match): void {
    if (match.winner !== RESULT_TIE) {
      const winner = match.players[match.winner];
      const loser = match.players[match.winner === 1 ? 0 : 1];
      this.playerStats[winner].realtimeWins++;
      this.playerStats[loser].realtimeLosses++;
    }
  }

  public updateStats(allMatches: Match[]): void {
    this.matches = allMatches;
  }

  public getRemainingMatches(): Match[] {
    return this.matches.filter(match => match.state !== "finished");
  }

  public getRanking(): PlayerRank[] {
    return this.players
      .map(player => ({pl: player, score: this.getPlayerScore(player)})) // mapping to copy
      .sort(
        (a, b) => b.score - a.score,
      ).map(player => new PlayerRank(player.pl, this.rankExplanation(player.pl)));
  }

  private getPlayerScore(player: Player): number {
    if (this.playerStats[player].realtimeWins + this.playerStats[player].realtimeLosses < 1) {
      return 0;
    }
    return this.playerStats[player].realtimeWins / (this.playerStats[player].realtimeWins + this.playerStats[player].realtimeLosses);
  }

  private rankExplanation(player: Player): string {
    const stats = this.playerStats[player];
    return "W " + stats.realtimeWins + " - L " + stats.realtimeLosses;
  }

  private playersAlreadyMatched(playerA: Player, playerB: Player) {
    return this.matches.find(match =>
      match.players[0] === playerA && match.players[1] === playerB ||
      match.players[1] === playerA && match.players[0] === playerB);
  }
}
