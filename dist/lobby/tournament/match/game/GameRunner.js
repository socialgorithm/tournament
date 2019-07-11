"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:gameRunner");
var io = require("socket.io-client");
var game_server_1 = require("@socialgorithm/game-server");
var Events_1 = require("../../../../events/Events");
var GameRunner = (function () {
    function GameRunner(matchID, game, options) {
        var _this = this;
        this.matchID = matchID;
        this.game = game;
        this.options = options;
        this.onFinish = function (message) {
            _this.game.stats = message.payload;
            _this.game.winner = message.winner;
            _this.game.tie = message.tie;
            _this.game.duration = message.duration;
            _this.game.message = message.message;
            _this.pubSub.unsubscribeAll();
            _this.pubSub.publishNamespaced(_this.matchID, Events_1.EVENTS.GAME_ENDED, _this.game);
        };
        this.onUpdate = function (message) {
            _this.game.stats = message.payload;
        };
        try {
            debug("Initialising Game Runner");
            debug("Connecting to %s", options.gameServerAddress);
            this.gameSocket = io(options.gameServerAddress, {
                reconnection: true,
                timeout: 2000
            });
            this.gameSocket.on("connect", function () {
                debug("Connected to Game Server, starting game");
                _this.start();
            });
            this.gameSocket.on("GAME_STARTED", this.onStart);
            this.gameSocket.on(game_server_1.GAME_SOCKET_MESSAGE.GAME_UPDATED, this.onUpdate);
            this.gameSocket.on(game_server_1.GAME_SOCKET_MESSAGE.GAME_ENDED, this.onFinish);
            this.gameSocket.on("disconnect", function () {
                debug("Connection to Game Server %s lost!", options.gameServerAddress);
            });
        }
        catch (e) {
            debug("sg: Unable to connect to Game Server. %O", e);
        }
    }
    GameRunner.prototype.close = function () {
        this.gameSocket.close();
    };
    GameRunner.prototype.start = function () {
        debug("Start game");
        this.gameSocket.emit(game_server_1.GAME_SOCKET_MESSAGE.START_GAME, {
            gameID: this.game.gameID,
            players: this.game.players
        });
    };
    GameRunner.prototype.onStart = function (message) {
        debug(this.game.gameID + " received game started message");
        for (var _i = 0, _a = message.playerGameTokens; _i < _a.length; _i++) {
            var player = _a[_i];
            var playerGameToken = message.playerGameTokens[player];
            this.pubSub.publish(Events_1.EVENTS.SERVER_TO_PLAYER, { player: player,
                event: Events_1.EVENTS.GAME_SERVER_HANDOFF,
                payload: {
                    gameServerAddress: this.options.gameServerAddress,
                    gameID: this.game.gameID,
                    token: playerGameToken
                }
            });
        }
    };
    return GameRunner;
}());
exports.GameRunner = GameRunner;
//# sourceMappingURL=GameRunner.js.map