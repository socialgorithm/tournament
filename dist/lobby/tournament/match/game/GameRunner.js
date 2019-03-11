"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:gameRunner");
var io = require("socket.io-client");
var game_server_1 = require("@socialgorithm/game-server");
var PubSub_1 = require("../../../../lib/PubSub");
var events_1 = require("../../../../socket/events");
var GameRunner = (function () {
    function GameRunner(matchID, game, options) {
        var _this = this;
        this.matchID = matchID;
        this.game = game;
        this.onFinish = function (message) {
            _this.game.stats = message.payload;
            _this.game.winner = message.winner;
            _this.game.tie = message.tie;
            _this.game.duration = message.duration;
            _this.game.message = message.message;
            _this.pubSub.unsubscribeAll();
            _this.pubSub.publishNamespaced(_this.matchID, events_1.EVENTS.GAME_ENDED, _this.game);
        };
        this.onUpdate = function (message) {
            _this.game.stats = message.payload;
        };
        this.onPlayerToGame = function (payload) {
            if (_this.game.players.indexOf(payload.player) < 0) {
                return;
            }
            _this.gameSocket.emit(game_server_1.GAME_SOCKET_MESSAGE.GAME__PLAYER, {
                payload: payload.data,
                player: payload.player
            });
        };
        this.onGameToPlayer = function (player, payload) {
            _this.pubSub.publish(events_1.EVENTS.SERVER_TO_PLAYER, {
                player: player,
                event: "game",
                payload: payload
            });
        };
        try {
            var host_1 = process.env.GAME_SERVER || options.host || "localhost:5433";
            if (host_1.substr(0, 4) !== "http") {
                host_1 = "http://" + host_1;
            }
            debug("Initialising Game Runner");
            debug("Connecting to %s", host_1);
            this.gameSocket = io(host_1, {
                reconnection: true,
                timeout: 2000
            });
            this.gameSocket.on("connect", function () {
                debug("Connected to Game Server, starting game");
                _this.start();
            });
            this.gameSocket.on(game_server_1.GAME_SOCKET_MESSAGE.GAME_UPDATED, this.onUpdate);
            this.gameSocket.on(game_server_1.GAME_SOCKET_MESSAGE.GAME_ENDED, this.onFinish);
            this.gameSocket.on(game_server_1.GAME_SOCKET_MESSAGE.GAME__PLAYER, function (data) {
                _this.onGameToPlayer(data.player, data.payload);
            });
            this.gameSocket.on("disconnect", function () {
                debug("Connection to Game Server %s lost!", host_1);
            });
        }
        catch (e) {
            debug("sg: Unable to connect to Game Server. %O", e);
        }
        this.pubSub = new PubSub_1["default"]();
        this.pubSub.subscribe(events_1.EVENTS.PLAYER_TO_GAME, this.onPlayerToGame);
    }
    GameRunner.prototype.close = function () {
        this.gameSocket.close();
    };
    GameRunner.prototype.start = function () {
        debug("Start game");
        this.gameSocket.emit(game_server_1.GAME_SOCKET_MESSAGE.START_GAME, {
            players: this.game.players
        });
    };
    return GameRunner;
}());
exports.GameRunner = GameRunner;
//# sourceMappingURL=GameRunner.js.map