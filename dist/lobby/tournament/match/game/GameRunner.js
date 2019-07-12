"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:gameRunner");
var io = require("socket.io-client");
var model_1 = require("@socialgorithm/model");
var PubSub_1 = require("../../../../pub-sub/PubSub");
var GameRunner = (function () {
    function GameRunner(matchID, game, options) {
        var _this = this;
        this.matchID = matchID;
        this.game = game;
        this.options = options;
        this.create = function () {
            debug("Create game %O", _this.game);
            _this.gameSocket.emit(model_1.GAME_SOCKET_MESSAGE.CREATE_GAME, {
                gameID: _this.game.gameID,
                players: _this.game.players
            });
        };
        this.onCreate = function (message) {
            debug("Game %s received game started message %O", _this.game.gameID, message);
            for (var _i = 0, _a = Object.entries(message.playerGameTokens); _i < _a.length; _i++) {
                var _b = _a[_i], player = _b[0], gameToken = _b[1];
                _this.pubSub.publish(model_1.EVENTS.SERVER_TO_PLAYER, { player: player,
                    event: model_1.EVENTS.GAME_SERVER_HANDOFF,
                    payload: {
                        gameServerAddress: _this.options.gameServerAddress,
                        gameID: _this.game.gameID,
                        token: gameToken
                    }
                });
            }
        };
        this.onFinish = function (message) {
            _this.game.stats = message.payload;
            _this.game.winner = message.winner;
            _this.game.tie = message.tie;
            _this.game.duration = message.duration;
            _this.game.message = message.message;
            _this.pubSub.unsubscribeAll();
            _this.pubSub.publishNamespaced(_this.matchID, model_1.EVENTS.GAME_ENDED, _this.game);
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
                _this.create();
            });
            this.gameSocket.on(model_1.GAME_SOCKET_MESSAGE.GAME_CREATED, this.onCreate);
            this.gameSocket.on(model_1.GAME_SOCKET_MESSAGE.GAME_UPDATED, this.onUpdate);
            this.gameSocket.on(model_1.GAME_SOCKET_MESSAGE.GAME_ENDED, this.onFinish);
            this.gameSocket.on("disconnect", function () {
                debug("Connection to Game Server %s lost!", options.gameServerAddress);
            });
        }
        catch (e) {
            debug("sg: Unable to connect to Game Server. %O", e);
        }
        this.pubSub = new PubSub_1["default"]();
    }
    GameRunner.prototype.close = function () {
        this.gameSocket.close();
    };
    return GameRunner;
}());
exports.GameRunner = GameRunner;
//# sourceMappingURL=GameRunner.js.map