"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:matchRunner");
var io = require("socket.io-client");
var model_1 = require("@socialgorithm/model");
var pub_sub_1 = require("../../pub-sub");
var MatchRunner = (function () {
    function MatchRunner(match, tournamentID, gameServerAddress) {
        var _this = this;
        this.match = match;
        this.tournamentID = tournamentID;
        this.gameServerAddress = gameServerAddress;
        this.sendMatchToGameServer = function () {
            debug("Sending match to game server: %O", _this.match);
            _this.gameServerSocket.emit(model_1.EventName.CreateMatch, { players: _this.match.players, options: _this.match.options });
            _this.match.state = "playing";
        };
        this.onMatchCreated = function (message) {
            debug("Received match created message %O", message);
            _this.playerTokens = message.playerTokens;
            _this.sendGameServerHandoffToPlayers();
        };
        this.sendGameServerHandoffToPlayers = function () {
            for (var _i = 0, _a = Object.entries(_this.playerTokens); _i < _a.length; _i++) {
                var _b = _a[_i], player = _b[0], token = _b[1];
                _this.pubSub.publish(pub_sub_1.Events.ServerToPlayer, {
                    player: player,
                    event: model_1.EventName.GameServerHandoff,
                    payload: {
                        gameServerAddress: _this.gameServerAddress,
                        token: token
                    }
                });
            }
        };
        this.onGameEnded = function (game) {
            debug("Finished game, winner %s", game.winner);
            game.players = game.players.map(function (token) { return _this.convertPlayerTokenToPlayerName(token); });
            game.winner = _this.convertPlayerTokenToPlayerName(game.winner);
            _this.match.games.push(game);
            _this.updateMatchStats();
            _this.pubSub.publishNamespaced(_this.tournamentID, pub_sub_1.Events.MatchUpdated, _this.match);
        };
        this.onMatchEnded = function (matchFromGameServer) {
            debug("Finished match " + _this.match.matchID);
            _this.match.state = "finished";
            if (matchFromGameServer != null) {
                debug("Received ended match from game server, overriding some vars %O", matchFromGameServer);
                _this.match.games = matchFromGameServer.games;
                _this.match.winner = matchFromGameServer.winner;
                _this.match.stats = matchFromGameServer.stats;
                _this.match.messages = matchFromGameServer.messages;
            }
            else {
                _this.updateMatchStats();
            }
            _this.gameServerSocket.disconnect();
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
        this.convertPlayerTokenToPlayerName = function (tokenToConvert) {
            for (var _i = 0, _a = Object.entries(_this.playerTokens); _i < _a.length; _i++) {
                var _b = _a[_i], player = _b[0], playerToken = _b[1];
                if (tokenToConvert === playerToken) {
                    return player;
                }
            }
            return tokenToConvert;
        };
        this.gameServerSocket = io(gameServerAddress, { reconnection: true, timeout: 2000 });
        this.gameServerSocket.on("connect", this.sendMatchToGameServer);
        this.gameServerSocket.on(model_1.EventName.MatchCreated, this.onMatchCreated);
        this.gameServerSocket.on(model_1.EventName.GameEnded, this.onGameEnded);
        this.gameServerSocket.on(model_1.EventName.MatchEnded, this.onMatchEnded);
        this.gameServerSocket.on("disconnect", function () {
            debug("Connection to Game Server %s lost!", gameServerAddress);
        });
        this.pubSub = new pub_sub_1.PubSub();
    }
    return MatchRunner;
}());
exports.MatchRunner = MatchRunner;
//# sourceMappingURL=MatchRunner.js.map