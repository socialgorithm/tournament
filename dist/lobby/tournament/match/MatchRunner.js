"use strict";
exports.__esModule = true;
var uuid = require("uuid/v4");
var debug = require("debug")("sg:matchRunner");
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
            debug("Finished game, winner %s", game.winner);
            _this.match.games.push(game);
            _this.updateMatchStats();
            _this.sendStats();
            _this.gameRunner.close();
            _this.playNextGame();
        };
        this.onMatchEnd = function () {
            _this.match.state = "finished";
            _this.updateMatchStats();
            debug("Finished match %o", _this.match.stats);
            _this.pubSub.publishNamespaced(_this.tournamentID, events_1.EVENTS.MATCH_ENDED, _this.match);
        };
        this.updateMatchStats = function () {
            _this.match.stats.gamesCompleted = _this.match.games.length;
            _this.match.stats.gamesTied = _this.match.games.filter(function (game) { return game.tie; }).length;
            _this.match.stats.wins = _this.match.players.map(function () { return 0; });
            _this.match.games.forEach(function (game) {
                if (!game.tie && game.winner) {
                    _this.match.stats.wins[_this.match.players.indexOf(game.winner)]++;
                }
            });
            var maxWins = _this.match.stats.wins[0];
            var maxIndex = 0;
            for (var i = 1; i < _this.match.stats.wins.length; i++) {
                if (_this.match.stats.wins[i] > maxWins) {
                    maxIndex = i;
                    maxWins = _this.match.stats.wins[i];
                }
            }
            _this.match.winner = maxIndex;
        };
        this.sendStats = function () {
            _this.pubSub.publishNamespaced(_this.tournamentID, events_1.EVENTS.MATCH_UPDATE, null);
        };
        this.pubSub = new PubSub_1["default"]();
        this.pubSub.subscribeNamespaced(this.match.matchID, events_1.EVENTS.GAME_ENDED, this.onGameEnd);
        debug("Starting match");
        this.match.state = "playing";
        this.playNextGame();
    }
    MatchRunner.prototype.onEnd = function () {
        this.pubSub.unsubscribeAll();
        if (this.gameRunner) {
            this.gameRunner.close();
        }
        delete this.gameRunner;
    };
    return MatchRunner;
}());
exports.MatchRunner = MatchRunner;
//# sourceMappingURL=MatchRunner.js.map