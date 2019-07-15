"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:matchRunner");
var model_1 = require("@socialgorithm/model");
var pub_sub_1 = require("../../pub-sub");
var MatchRunner = (function () {
    function MatchRunner(match, tournamentID, gameServerAddress) {
        var _this = this;
        this.match = match;
        this.tournamentID = tournamentID;
        this.gameServerAddress = gameServerAddress;
        this.sendMatchToGameServer = function () {
            _this.gameServerSocket.emit(new model_1.Events.CreateMatchEvent({ players: _this.match.players, options: _this.match.options }));
            _this.match.state = "playing";
        };
        this.onMatchCreated = function (message) {
            debug("Received match created message %O", message);
            for (var _i = 0, _a = Object.entries(message.playerTokens); _i < _a.length; _i++) {
                var _b = _a[_i], player = _b[0], token = _b[1];
                _this.pubSub.publish(pub_sub_1.Events.ServerToPlayer, { player: player,
                    event: new model_1.Events.GameServerHandoffEvent({
                        gameServerAddress: _this.gameServerAddress,
                        token: token
                    })
                });
            }
        };
        this.onGameEnded = function (game) {
            debug("Finished game, winner %s", game.winner);
            _this.match.games.push(game);
            _this.updateMatchStats();
            _this.pubSub.publishNamespaced(_this.tournamentID, pub_sub_1.Events.MatchUpdated, _this.match);
        };
        this.onMatchEnded = function () {
            _this.match.state = "finished";
            _this.updateMatchStats();
            debug("Finished match %o", _this.match.stats);
            _this.pubSub.publishNamespaced(_this.tournamentID, pub_sub_1.Events.MatchEnded, _this.match);
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
        this.gameServerSocket.socketIOSocket.on("connect", this.sendMatchToGameServer);
        this.gameServerSocket.addHandler(new model_1.Handlers.MatchCreatedEventHandler(this.onMatchCreated));
        this.gameServerSocket.addHandler(new model_1.Handlers.GameEndedEventHandler(this.onGameEnded));
        this.gameServerSocket.addHandler(new model_1.Handlers.MatchEndedEventHandler(this.onMatchEnded));
        this.gameServerSocket.socketIOSocket.on("disconnect", function () {
            debug("Connection to Game Server %s lost!", gameServerAddress);
        });
        this.match.state = "playing";
    }
    return MatchRunner;
}());
exports.MatchRunner = MatchRunner;
//# sourceMappingURL=MatchRunner.js.map