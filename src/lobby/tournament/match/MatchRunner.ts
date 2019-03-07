import * as uuid from "uuid/v4";
import PubSub from "../../../lib/PubSub";
import { EVENTS } from "../../../socket/events";
import * as funcs from "./funcs";
import { Game } from "./game/Game";
import { GameRunner } from "./game/GameRunner";
import { INITIAL_STATS, IStats, Match, MatchStats } from "./Match";

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
        this.updateMatchStats();
        this.pubSub.publishNamespaced(
            this.tournamentID,
            EVENTS.MATCH_ENDED,
            null,
        );
    }

    private updateMatchStats = () => {
        // Calculate match stats here
        // TODO use games array
        const stats: MatchStats = this.match.stats;
        const gameStats: IStats = {};
        // Get winner
        if (stats.wins[0] === stats.wins[1]) {
            gameStats.winner = -1;
        } else if (stats.wins[0] > stats.wins[1]) {
            gameStats.winner = 0;
        } else {
            gameStats.winner = 1;
        }

        gameStats.winPercentages = [
            funcs.getPercentage(stats.wins[0], stats.gamesCompleted),
            funcs.getPercentage(stats.wins[1], stats.gamesCompleted),
        ];

        gameStats.tiePercentage = funcs.getPercentage(stats.gamesTied, stats.gamesCompleted);

        // Get avg exec time
        let sum = 0;
        gameStats.total = 0;
        gameStats.max = 0;
        gameStats.avg = 0;
        gameStats.min = 1000;

        if (stats.times.length > 0) {
            stats.times.forEach(eachTime => {
                gameStats.total += eachTime;
                sum += eachTime;
                gameStats.max = Math.max(gameStats.max, eachTime);
                gameStats.min = Math.min(gameStats.min, eachTime);
            });
            gameStats.avg = funcs.round(sum / stats.times.length);
            gameStats.total = funcs.round(gameStats.total);
            gameStats.max = funcs.round(gameStats.max);
            gameStats.min = funcs.round(gameStats.min);
            gameStats.avg = funcs.round(gameStats.avg);
        }

        console.log("Updated Match Stats", stats);

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
