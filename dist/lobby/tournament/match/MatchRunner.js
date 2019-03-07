"use strict";
exports.__esModule = true;
var uuid = require("uuid/v4");
var PubSub_1 = require("../../../lib/PubSub");
var events_1 = require("../../../socket/events");
var funcs = require("./funcs");
var GameRunner_1 = require("./game/GameRunner");
var MatchRunner = (function () {
    function MatchRunner(match, tournamentID) {
        var _this = this;
        this.match = match;
        this.tournamentID = tournamentID;
        this.playNextGame = function () {
            var gamesPlayed = _this.match.games.length;
            if (gamesPlayed >= _this.match.options.maxGames) {
                _this.onMatchEnd();
                return;
            }
            var game = {
                gameID: uuid(),
                players: _this.match.players,
                stats: null,
                winner: null,
                tie: false,
                duration: 0,
                message: ""
            };
            _this.gameRunner = new GameRunner_1.GameRunner(_this.match.matchID, game, {});
        };
        this.onGameEnd = function (game) {
            _this.match.games.push(game);
            _this.updateMatchStats();
            _this.sendStats();
            _this.gameRunner.close();
            _this.playNextGame();
        };
        this.onMatchEnd = function () {
            _this.updateMatchStats();
            _this.pubSub.publishNamespaced(_this.tournamentID, events_1.EVENTS.MATCH_ENDED, null);
        };
        this.updateMatchStats = function () {
            var stats = _this.match.stats;
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
            console.log("Updated Match Stats", stats);
            _this.match.stats = stats;
        };
        this.sendStats = function () {
            _this.pubSub.publishNamespaced(_this.tournamentID, events_1.EVENTS.MATCH_UPDATE, null);
        };
        this.pubSub = new PubSub_1["default"]();
        this.pubSub.subscribeNamespaced(this.match.matchID, events_1.EVENTS.GAME_ENDED, this.onGameEnd);
    }
    MatchRunner.prototype.start = function () {
        this.match.state = "playing";
        this.playNextGame();
    };
    return MatchRunner;
}());
exports.MatchRunner = MatchRunner;
//# sourceMappingURL=MatchRunner.js.map