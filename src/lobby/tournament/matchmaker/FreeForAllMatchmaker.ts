import * as uuid from "uuid/v4";

import { Player } from "@socialgorithm/game-server";
import { Match, MatchOptions } from "@socialgorithm/model";
import IMatchmaker from "./Matchmaker";

/**
 * FreeForAll is a strategy where only one round is played, in which every player
 * plays against every other player in the tournament.
 *
 * The winner will be the player that has won the most games.
 *
 */
export default class FreeForAllMatchmaker implements IMatchmaker {

  private matches: Match[];

  constructor(private players: Player[], private options: MatchOptions) {
    this.matches = [];

    this.players.forEach(playerA => {
      this.players.forEach(playerB => {
        if (playerA !== playerB && !this.playersAlreadyMatched(playerA, playerB)) {
          this.matches.push({
            games: [],
            matchID: uuid(),
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

  public updateStats(allMatches: Match[], tournamentFinished: boolean = false) {
    this.matches = allMatches;
  }

  public getRemainingMatches(): Match[] {
    return this.matches.filter(match => match.state !== "finished");
  }

  public getRanking(): string[] {
    const playerStats: any = {};
    this.matches.forEach(match => {
      if (!playerStats[match.players[0]]) {
        playerStats[match.players[0]] = 0;
      }
      if (!playerStats[match.players[1]]) {
        playerStats[match.players[1]] = 0;
      }
      // TODO Create stat calculator for matches
      // const p0wins = match.stats.wins[0];
      // const p1wins = match.stats.wins[1];
      // if (p0wins === p1wins) {
      //     return;
      // }
      // if (p0wins > p1wins) {
      //     playerStats[match.players[0]]++;
      // }
      // if (p1wins > p0wins) {
      //     playerStats[match.players[1]]++;
      // }
    });
    return Object.keys(playerStats).map(token => ({
      gamesWon: playerStats[token],
      player: token,
    })).sort(
      (a: any, b: any) => b.gamesWon - a.gamesWon,
    ).map(playerRank => playerRank.player,
    );
  }

  private playersAlreadyMatched(playerA: Player, playerB: Player) {
    return this.matches.find(match =>
      match.players[0] === playerA && match.players[1] === playerB ||
      match.players[1] === playerA && match.players[0] === playerB);
  }
}
