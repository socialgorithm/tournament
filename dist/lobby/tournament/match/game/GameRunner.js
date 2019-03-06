"use strict";
exports.__esModule = true;
var constants_1 = require("@socialgorithm/game-server/dist/constants");
var io = require("socket.io-client");
var PubSub_1 = require("../../../../lib/PubSub");
var events_1 = require("../../../../socket/events");
var GameRunner = (function () {
    function GameRunner(matchID, game, options) {
        var _this = this;
        this.matchID = matchID;
        this.game = game;
        try {
            var host = options.host || "localhost:5433";
            if (host.substr(0, 4) !== "http") {
                host = "http://" + host;
            }
            console.log("Initialising Game Runner");
            console.log("Connecting to " + host);
            this.gameSocket = io(host, {
                reconnection: true,
                timeout: 2000
            });
            this.gameSocket.on("connect", function () {
                console.log("Connected to Game Server, starting game");
                _this.start();
            });
            this.gameSocket.on(constants_1.SOCKET_MESSAGE.GAME_MESSAGE, function (data) {
                console.log("Received a game message", data);
                _this.onGameToServer(data);
            });
            this.gameSocket.on(constants_1.SOCKET_MESSAGE.PLAYER_MESSAGE, function (data) {
                console.log("Proxy message to player", data);
                _this.onGameToPlayer(data.player, data.payload);
            });
            this.gameSocket.on("disconnect", function () {
                console.log("Connection lost!");
            });
        }
        catch (e) {
            console.log("tournament-server: Unable to connect to Game Server:", e);
        }
        this.pubSub = new PubSub_1["default"]();
        this.pubSub.subscribe(events_1.EVENTS.PLAYER_TO_GAME, this.onPlayerToGame);
    }
    GameRunner.prototype.start = function () {
        this.sendToGame({
            payload: {
                players: this.game.players
            },
            type: "START"
        });
    };
    GameRunner.prototype.onFinish = function (data) {
        this.game.stats = data.stats;
        this.game.winner = data.winner;
        this.game.tie = data.tie;
        this.game.duration = data.duration;
        this.game.message = data.message;
        this.pubSub.unsubscribeAll();
        this.pubSub.publishNamespaced(this.matchID, events_1.EVENTS.GAME_ENDED, null);
    };
    GameRunner.prototype.onUpdate = function (data) {
        this.game.stats = data.stats;
    };
    GameRunner.prototype.onGameToServer = function (data) {
        switch (data.type) {
            case "UPDATE":
                this.onUpdate(data.payload);
                break;
            case "END":
                this.onFinish(data.payload);
                break;
            default:
                console.error("Unsupported message from game server");
        }
    };
    GameRunner.prototype.onPlayerToGame = function (data) {
        if (this.game.players.indexOf(data.player) < 0) {
            return;
        }
        this.gameSocket.send(constants_1.SOCKET_MESSAGE.PLAYER_MESSAGE, {
            payload: data.payload,
            player: data.player
        });
    };
    GameRunner.prototype.onGameToPlayer = function (player, data) {
    };
    GameRunner.prototype.sendToGame = function (data) {
        this.gameSocket.send(constants_1.SOCKET_MESSAGE.GAME_MESSAGE, data);
    };
    return GameRunner;
}());
exports.GameRunner = GameRunner;
//# sourceMappingURL=GameRunner.js.map