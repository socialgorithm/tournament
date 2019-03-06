"use strict";
exports.__esModule = true;
var uuid = require("uuid/v4");
var PubSub_1 = require("../../../lib/PubSub");
var events_1 = require("../../../socket/events");
var funcs = require("./funcs");
var GameRunner_1 = require("./game/GameRunner");
var Match_1 = require("./Match");
var MatchRunner = (function () {
    function MatchRunner(match, tournamentID) {
        this.match = match;
        this.tournamentID = tournamentID;
        this.pubSub = new PubSub_1["default"]();
        this.pubSub.subscribeNamespaced(this.match.matchID, events_1.EVENTS.GAME_ENDED, this.onGameEnd);
    }
    MatchRunner.prototype.start = function () {
        this.playNextGame();
    };
    MatchRunner.prototype.playNextGame = function () {
        var gamesPlayed = this.match.games.length;
        if (gamesPlayed >= this.match.options.maxGames) {
            this.onMatchEnd();
            return;
        }
        var gameRunner = new GameRunner_1.GameRunner(this.match.matchID, {});
        var game = {
            gameID: uuid(),
            players: this.match.players,
            stats: null,
            winner: null,
            tie: false,
            duration: 0,
            message: ""
        };
        gameRunner.start(game);
    };
    MatchRunner.prototype.onGameEnd = function (game) {
        this.match.games.push(game);
        this.updateMatchStats();
        this.sendStats();
        this.playNextGame();
    };
    MatchRunner.prototype.onMatchEnd = function () {
        this.updateMatchStats();
        this.pubSub.publishNamespaced(this.tournamentID, events_1.EVENTS.MATCH_ENDED, null);
    };
    MatchRunner.prototype.updateMatchStats = function () {
        var stats = Match_1.INITIAL_STATS;
        var gameStats = {};
        if (stats.wins[0] === stats.wins[1]) {
            gameStats.winner = -1;
        }
        else if (stats.wins[0] > stats.wins[1]) {
            gameStats.winner = 0;
        }
        else {
            gameStats.winner = 1;
        }
        gameStats.winPercentages = [
            funcs.getPercentage(stats.wins[0], stats.gamesCompleted),
            funcs.getPercentage(stats.wins[1], stats.gamesCompleted),
        ];
        gameStats.tiePercentage = funcs.getPercentage(stats.gamesTied, stats.gamesCompleted);
        var sum = 0;
        gameStats.total = 0;
        gameStats.max = 0;
        gameStats.avg = 0;
        gameStats.min = 1000;
        if (stats.times.length > 0) {
            stats.times.forEach(function (eachTime) {
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
        this.match.stats = stats;
    };
    MatchRunner.prototype.sendStats = function () {
        this.pubSub.publishNamespaced(this.tournamentID, events_1.EVENTS.MATCH_UPDATE, null);
    };
    return MatchRunner;
}());
exports.MatchRunner = MatchRunner;
//# sourceMappingURL=MatchRunner.js.map