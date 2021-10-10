import { Match, MatchOptions, Player, PlayerRank } from "@socialgorithm/model";
import { v4 as uuid } from "uuid";
import { DoubleEliminationMatch, MatchParent } from "./DoubleEliminationMatch";
import IMatchmaker from "./MatchMaker";

type PlayerStats = {
  player: Player;
  wins: number;
  losses: number;
  uiWins: number;
  uiLosses: number;
};

type MatchingResult = {
  matches?: DoubleEliminationMatch[];
  oddPlayer?: Player;
};

const RESULT_TIE = -1;

/**
 * DoubleElimination is a strategy where each player plays atleast two games before
 * being eliminated.
 *
 */
export default class DoubleEliminationMatchmaker implements IMatchmaker {
  private players: Player[];
  private finished: boolean;
  private playedMatches: Match[];
  private ranking: PlayerRank[];
  private processedMatches: string[];
  private playerStats: { [key: string]: PlayerStats };
  private zeroLossOddPlayer: Player;
  private oneLossOddPlayer: Player;
  private waitingForFinal: Player[];
  private unlinkedMatches: DoubleEliminationMatch[] = [];

  constructor(players: Player[], private options: MatchOptions) {
    this.players = this.shufflePlayers(players);
    this.playedMatches = [];
    this.processedMatches = [];
    this.ranking = this.players.map(player => new PlayerRank(player,""));
    this.playerStats = {};
    this.players.forEach(player => {
      this.playerStats[player] = { player, wins: 0, losses: 0, uiWins: 0, uiLosses: 0 };
    });
    this.waitingForFinal = [];
  }

  public isFinished(): boolean {
    return this.finished;
  }

  public updateUIStats(match: Match) {
    if (match.winner !== RESULT_TIE) {
      const winner = match.players[match.winner];
      const loser = match.players[match.winner === 1 ? 0 : 1];
      this.playerStats[winner].uiWins++;
      this.playerStats[loser].uiLosses++;
    }
    this.ranking = this.getUpdatedRanking();
  }

  public updateStats(playedMatches: Match[], tournamentFinished: boolean = false) {
    this.playedMatches = playedMatches;

    const justPlayedMatches = this.playedMatches.filter(match =>
      this.processedMatches.indexOf(match.matchID) === -1,
    );

    let tiedMatches = 0;

    justPlayedMatches.forEach((match: DoubleEliminationMatch) => {
      if (match.winner !== RESULT_TIE) {
        const winner = match.players[match.winner];
        const loser = match.players[match.winner === 1 ? 0 : 1];
        this.playerStats[winner].wins++;
        this.playerStats[loser].losses++;
      } else {
        tiedMatches++;
      }
    });

    this.ranking = this.getUpdatedRanking();

    if (tiedMatches < 1 && justPlayedMatches.length === 1 && !this.anyPlayersWaiting()) {
      this.finished = true;
    }
  }

  public getRemainingMatches(): DoubleEliminationMatch[] {
    const matches: DoubleEliminationMatch[] = [];

    if (this.playedMatches.length === 0) {
      const matchResult = this.matchPlayers(this.players);
      this.zeroLossOddPlayer = matchResult.oddPlayer;
      return matchResult.matches;
    }

    const justPlayedMatches = this.playedMatches.filter(match =>
      this.processedMatches.indexOf(match.matchID) === -1,
    );

    const tiedPlayers: Player[] = [];

    justPlayedMatches.forEach((match: DoubleEliminationMatch) => {
      this.processedMatches.push(match.matchID);
      if (match.winner === RESULT_TIE) {
        matches.push(
          this.createMatch(
            match.players[0],
            match.players[1],
            { timeout: match.options.timeout / 2 },
            [{ playerIndex: 0, parent: match.matchID }, { playerIndex: 1, parent: match.matchID }],
          ),
        );
        tiedPlayers.push(...match.players);
      }
    },
    );

    if (matches.length < 1 && justPlayedMatches.length === 1 && !this.anyPlayersWaiting()) {
      this.finished = true;
      this.ranking = this.getUpdatedRanking();
      return [];
    }

    const zeroLossPlayers: Player[] = [];
    const oneLossPlayers: Player[] = [];

    Object.keys(this.playerStats).forEach(playerToken => {
      const stats = this.playerStats[playerToken];
      if (!this.playerIsWaitingForMatch(stats.player) && tiedPlayers.indexOf(stats.player) === -1) {
        if (stats.losses === 0) {
          zeroLossPlayers.push(stats.player);
        } else if (stats.losses === 1) {
          oneLossPlayers.push(stats.player);
        }
      }
    });

    if (this.zeroLossOddPlayer != null) {
      zeroLossPlayers.unshift(this.zeroLossOddPlayer);
      delete this.zeroLossOddPlayer;
    }
    if (this.oneLossOddPlayer != null) {
      oneLossPlayers.unshift(this.oneLossOddPlayer);
      delete this.oneLossOddPlayer;
    }

    if (zeroLossPlayers.length > 1) {
      const matchResult = this.matchPlayers(zeroLossPlayers);
      matches.push(...matchResult.matches);
      this.zeroLossOddPlayer = matchResult.oddPlayer;
    } else if (zeroLossPlayers.length === 1) {
      this.waitingForFinal.push(zeroLossPlayers[0]);
    }
    if (oneLossPlayers.length > 1) {
      const matchResult = this.matchPlayers(oneLossPlayers);
      matches.push(...matchResult.matches);
      this.oneLossOddPlayer = matchResult.oddPlayer;
    } else if (oneLossPlayers.length === 1) {
      this.waitingForFinal.push(oneLossPlayers[0]);
    }

    if (this.waitingForFinal.length > 1) {
      const matchResult = this.matchPlayers(this.waitingForFinal);
      matches.push(...matchResult.matches);
      this.waitingForFinal = [];
    }

    return matches;
  }

  public getRanking(): PlayerRank[] {
    return this.ranking;
  }

  public getPlayers(): Player[] {
    return [...this.players];
  }

  private rankExplanation(player: Player): string {
    const stats = this.playerStats[player];
    return "W "+stats.uiWins+" - L "+stats.uiLosses;
  }

  private getUpdatedRanking(): PlayerRank[] {
    return this.players
      .map(player => ({pl: player, score: this.getPlayerScore(player)})) // mapping to copy
      .sort(
        (a, b) => b.score - a.score,
      ).map(player => new PlayerRank(player.pl, this.rankExplanation(player.pl)));
  }

  private getPlayerScore(player: Player): number {
    if (this.playerStats[player].uiWins + this.playerStats[player].uiLosses < 1) {
      return 0;
    }
    return this.playerStats[player].uiWins / (this.playerStats[player].uiWins + this.playerStats[player].uiLosses);
  }

  private shufflePlayers([...players]: Player[]): Player[] {
    let m = players.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [players[m], players[i]] = [players[i], players[m]];
    }
    return players;
  }

  private matchPlayers(players: Player[]): MatchingResult {
    const matches: DoubleEliminationMatch[] = [];
    let oddPlayer: Player;

    if (players.length < 2) {
      return {};
    }

    if (players.length % 2 !== 0) {
      oddPlayer = players[players.length - 1];
      players = players.slice(0, -1);
    }

    for (let i = 0; i < players.length; i += 2) {
      const playerA = players[i];
      const playerB = players[i + 1];
      matches.push(this.createMatch(playerA, playerB));
    }

    return { matches, oddPlayer };
  }

  private createMatch(playerA: Player, playerB: Player, optionOverrides?: any, parentMatches?: MatchParent[]): DoubleEliminationMatch {
    const finalOptions = Object.assign(this.options, optionOverrides || {});
    const match: DoubleEliminationMatch = {
      games: [],
      matchID: uuid(),
      messages: [],
      options: finalOptions,
      parentMatches,
      players: [playerA, playerB],
      state: "upcoming",
      winner: -1,
      stats: {
        gamesCompleted: 0,
        gamesTied: 0,
        wins: [],
      },
    };

    if (parentMatches) {
      match.parentMatches = parentMatches;
    } else {
      this.setParentMatches(match);
    }
    this.unlinkedMatches.push(match);

    return match;
  }

  private playerIsWaitingForMatch(player: Player): boolean {
    return this.waitingForFinal.indexOf(player) >= 0 || player === this.zeroLossOddPlayer || player === this.oneLossOddPlayer;
  }

  private anyPlayersWaiting(): boolean {
    return this.waitingForFinal.length > 0 || !!this.zeroLossOddPlayer || !!this.oneLossOddPlayer;
  }

  private setParentMatches(match: DoubleEliminationMatch) {
    const playerTokens = match.players.map(player => player);

    // find out if this match came from another
    const parentMatches = this.unlinkedMatches.filter((eachMatch): boolean => {
      const winner = eachMatch.players[eachMatch.winner];
      if (!winner) {
        return false;
      }
      return playerTokens.indexOf(winner) > -1;
    }).map(eachMatch => {
      const winner = eachMatch.players[eachMatch.winner];
      return {
        parent: eachMatch.matchID,
        playerIndex: playerTokens.indexOf(winner),
      };
    },
    );

    parentMatches.forEach(matchParent => {
      const unlinkedIndex = this.unlinkedMatches.findIndex(eachMatch => eachMatch.matchID === matchParent.parent);
      this.unlinkedMatches.splice(unlinkedIndex, 1);
    });

    match.parentMatches = parentMatches;
  }

}
