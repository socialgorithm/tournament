"use strict";
exports.__esModule = true;
var uuid = require("uuid/v4");
var PubSub_1 = require("../../../lib/PubSub");
var events_1 = require("../../../socket/events");
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
            _this.match.state = "finished";
            _this.updateMatchStats();
            _this.pubSub.publishNamespaced(_this.tournamentID, events_1.EVENTS.MATCH_ENDED, _this.match);
        };
        this.updateMatchStats = function () {
            var stats = _this.match.stats;
            stats.gamesCompleted = _this.match.games.length;
            stats.gamesTied = _this.match.games.filter(function (game) { return game.tie; }).length;
            stats.wins = _this.match.players.map(function () { return 0; });
            _this.match.games.forEach(function (game) {
                if (!game.tie && game.winner) {
                    stats.wins[_this.match.players.indexOf(game.winner)]++;
                }
            });
            var maxWins = stats.wins[0];
            var maxIndex = 0;
            for (var i = 1; i < stats.wins.length; i++) {
                if (stats.wins[i] > maxWins) {
                    maxIndex = i;
                    maxWins = stats.wins[i];
                }
            }
            _this.match.winner = maxIndex;
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