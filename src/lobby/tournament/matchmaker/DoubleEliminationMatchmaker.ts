import IMatchmaker from "./Matchmaker";
import { Tournament } from "../Tournament";
import { DoubleEliminationMatch, MatchParent } from "./DoubleEliminationMatch";
import { MatchOptions } from "../match/Match";
import { Player } from "@socialgorithm/game-server/src/constants";

type PlayerStats = {
    player: Player;
    wins: number;
    losses: number;
}

type MatchingResult = {
    matches?: DoubleEliminationMatch[];
    oddPlayer?: Player;
}

const RESULT_TIE = -1;

/**
 * DoubleElimination is a strategy where each player plays atleast two games before
 * being eliminated.
 *
 */
export default class DoubleEliminationMatchmaker implements IMatchmaker {
    private finished: boolean;
    private tournament: Tournament;
    private ranking: string[];
    private processedMatches: string[];
    private playerStats: { [key: string]: PlayerStats };
    private zeroLossOddPlayer: Player;
    private oneLossOddPlayer: Player;
    private waitingForFinal: Player[];
    private unlinkedMatches: DoubleEliminationMatch[] = [];

    constructor(private players: Player[], private options: MatchOptions) {
        this.processedMatches = [];
        this.ranking = this.players.map(player => player);
        this.playerStats = {};
        this.players.forEach(player => {
            this.playerStats[player] = { player, wins: 0, losses: 0 };
        });
        this.waitingForFinal = [];
    }

    public isFinished(): boolean {
        return this.finished;
    }

    public updateStats(tournament: Tournament) {
        this.tournament = tournament;

        const justPlayedMatches = this.tournament.matches.filter(match =>
            this.processedMatches.indexOf(match.matchID) === -1,
        );
        let tiedMatches = 0;

        justPlayedMatches.forEach((match: DoubleEliminationMatch) => {
            // TODO Use match stats calculator
            // if (match.stats.winner !== RESULT_TIE) {
            //     const winnerToken = match.players[match.stats.winner].token;
            //     const loserToken = match.players[match.stats.winner === 1 ? 0 : 1].token;
            //     this.playerStats[winnerToken].wins++;
            //     this.playerStats[loserToken].losses++;
            // } else {
            //     tiedMatches++;
            // }
        });

        if (!this.tournament.finished) {
            this.ranking = this.unfinishedRanking();
        }

        if (tiedMatches < 1 && justPlayedMatches.length === 1 && !this.anyPlayersWaiting()) {
            this.finished = true;
            this.ranking = this.finishedRanking();
        }
    }

    public getRemainingMatches(): DoubleEliminationMatch[] {
        const matches: DoubleEliminationMatch[] = [];

        if (this.tournament.matches.length === 0) {
            const matchResult = this.matchPlayers(this.players);
            this.zeroLossOddPlayer = matchResult.oddPlayer;
            return matchResult.matches;
        }

        const justPlayedMatches = this.tournament.matches.filter(match =>
            this.processedMatches.indexOf(match.matchID) === -1,
        );

        const tiedPlayers: Player[] = [];

        justPlayedMatches.forEach((match: DoubleEliminationMatch) => {
                this.processedMatches.push(match.matchID);
                // TODO match stats
                // if (match.stats.winner === RESULT_TIE) {
                //     matches.push(
                //         this.createMatch(
                //             match.players[0],
                //             match.players[1],
                //             { timeout: match.options.timeout / 2 },
                //             [{playerIndex: 0, parent: match.matchID}, {playerIndex: 1, parent: match.matchID}],
                //         ),
                //     );
                //     tiedPlayers.push(...match.players);
                // }
            },
        );

        if (matches.length < 1 && justPlayedMatches.length === 1 && !this.anyPlayersWaiting()) {
            this.finished = true;
            this.ranking = this.finishedRanking();
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

    public getRanking(): string[] {
        return this.ranking;
    }

    private finishedRanking(): string[] {
        const ranking: string[] = [];
        const matches = this.tournament.matches.map(match => match); // mapping to copy
        matches.reverse().forEach(match => {
            // TODO Calculate the ranking
            // if (match.winner !== RESULT_TIE) {
            //     const winner = match.players[match.stats.winner].token;
            //     const loser = match.players[match.stats.winner === 1 ? 0 : 1].token;
            //     if (ranking.indexOf(winner) === -1) {
            //         ranking.push(winner);
            //     }
            //     if (ranking.indexOf(loser) === -1) {
            //         ranking.push(loser);
            //     }
            // }
        });
        const playersAwaitingMatch = this.players.map(player => player).filter(token => ranking.indexOf(token) === -1);
        ranking.push(...playersAwaitingMatch);
        return ranking;
    }

    private unfinishedRanking(): string[] {
        return this.players
            .map(player => player) // mapping to copy
            .sort(
                (a: Player, b: Player) => this.getPlayerScore(b) - this.getPlayerScore(a),
            ).map(player => player);
    }

    private getPlayerScore(player: Player): number {
        return this.playerStats[player].wins / (this.playerStats[player].wins + this.playerStats[player].losses);
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
            players: [playerA, playerB],
            parentMatches,
            matchID: '',
            state: 'upcoming',
            games: [],
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
        // TODO Use Match stats calculator
        // const playerTokens = match.players.map(player => player);

        // // find out if this match came from another
        // const parentMatches = this.unlinkedMatches.filter((eachMatch): boolean => {
        //     const winner = eachMatch.players[eachMatch.stats.winner];
        //     if (!winner) {
        //         return false;
        //     }
        //     return playerTokens.indexOf(winner) > -1;
        // }).map(eachMatch => {
        //         const winner = eachMatch.players[eachMatch.stats.winner];
        //         return {
        //             parent: eachMatch.matchID,
        //             playerIndex: playerTokens.indexOf(winner),
        //         };
        //     },
        // );

        // parentMatches.forEach(matchParent => {
        //     const unlinkedIndex = this.unlinkedMatches.findIndex(eachMatch => eachMatch.matchID === matchParent.parent);
        //     this.unlinkedMatches.splice(unlinkedIndex, 1);
        // });

        // match.parentMatches = parentMatches;
    }
}
