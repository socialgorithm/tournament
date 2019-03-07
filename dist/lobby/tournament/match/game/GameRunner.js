"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:gameRunner");
var constants_1 = require("@socialgorithm/game-server/dist/constants");
var io = require("socket.io-client");
var PubSub_1 = require("../../../../lib/PubSub");
var events_1 = require("../../../../socket/events");
var GameRunner = (function () {
    function GameRunner(matchID, game, options) {
        var _this = this;
        this.matchID = matchID;
        this.game = game;
        this.onFinish = function (data) {
            _this.game.stats = data.payload.stats;
            _this.game.winner = data.payload.winner;
            _this.game.tie = data.payload.tie;
            _this.game.duration = data.payload.duration;
            _this.game.message = data.payload.message;
            _this.pubSub.unsubscribeAll();
            _this.pubSub.publishNamespaced(_this.matchID, events_1.EVENTS.GAME_ENDED, _this.game);
        };
        this.onUpdate = function (data) {
            _this.game.stats = data.stats;
        };
        this.onPlayerToGame = function (payload) {
            if (_this.game.players.indexOf(payload.player) < 0) {
                return;
            }
            _this.gameSocket.emit(constants_1.SOCKET_MESSAGE.GAME__PLAYER, {
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
            var host_1 = options.host || "localhost:5433";
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
            this.gameSocket.on(constants_1.SOCKET_MESSAGE.UPDATE, this.onUpdate);
            this.gameSocket.on(constants_1.SOCKET_MESSAGE.GAME_ENDED, this.onFinish);
            this.gameSocket.on(constants_1.SOCKET_MESSAGE.GAME__PLAYER, function (data) {
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
        this.gameSocket.emit(constants_1.SOCKET_MESSAGE.START_GAME, {
            players: this.game.players
        });
    };
    return GameRunner;
}());
exports.GameRunner = GameRunner;
//# sourceMappingURL=GameRunner.js.map