import * as uuid from "uuid/v4";
import PubSub from "../../../lib/PubSub";
import { EVENTS } from "../../../socket/events";
import * as funcs from "./funcs";
import { Game } from "./game/Game";
import { GameRunner } from "./game/GameRunner";
import { Match, MatchStats } from "./Match";

export class MatchRunner {
    private pubSub: PubSub;
    private gameRunner: GameRunner;

    constructor(private match: Match, private tournamentID: string) {
        this.pubSub = new PubSub();
        this.pubSub.subscribeNamespaced(this.match.matchID, EVENTS.GAME_ENDED, this.onGameEnd);
    }

    public start() {
        this.match.state = "playing";
        this.playNextGame();
    }

    private playNextGame = () => {
        const gamesPlayed = this.match.games.length;
        // TODO also stop if more games have been won by one player than games are remaining
        if (gamesPlayed >= this.match.options.maxGames) {
            this.onMatchEnd();
            return;
        }
        const game: Game = {
            gameID: uuid(),
            players: this.match.players,
            stats: null,
            winner: null,
            tie: false,
            duration: 0,
            message: "", // optional message for the UI
        };
        // The game runner will connect to the game server and automatically start the game
        // after connecting
        // tslint:disable-next-line:no-unused-expression
        this.gameRunner = new GameRunner(this.match.matchID, game, {});
    }

    private onGameEnd = (game: Game) => {
        this.match.games.push(game);
        this.updateMatchStats();
        this.sendStats();
        this.gameRunner.close();
        this.playNextGame();
    }

    private onMatchEnd = () => {
        this.match.state = "finished";
        this.updateMatchStats();
        this.pubSub.publishNamespaced(
            this.tournamentID,
            EVENTS.MATCH_ENDED,
            this.match,
        );
    }

    private updateMatchStats = () => {
        // Calculate match stats here
        const stats: MatchStats = this.match.stats;
        stats.gamesCompleted = this.match.games.length;
        stats.gamesTied = this.match.games.filter(game => game.tie).length;
        stats.wins = this.match.players.map(() => 0);
        this.match.games.forEach(game => {
            if (!game.tie && game.winner) {
                stats.wins[this.match.players.indexOf(game.winner)]++;
            }
        });

        // Get the match winner
        let maxWins = stats.wins[0];
        let maxIndex = 0;

        for (let i = 1; i < stats.wins.length; i++) {
            if (stats.wins[i] > maxWins) {
                maxIndex = i;
                maxWins = stats.wins[i];
            }
        }

        this.match.winner = maxIndex;
        this.match.stats = stats;
    }

    private sendStats = () => {
        this.pubSub.publishNamespaced(
            this.tournamentID,
            EVENTS.MATCH_UPDATE,
            null,
        );
    }
}
