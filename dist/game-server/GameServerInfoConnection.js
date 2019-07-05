"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:gameServerInfoConnection");
var io = require("socket.io-client");
var game_server_1 = require("@socialgorithm/game-server");
var Events_1 = require("../Events");
var PubSub_1 = require("../PubSub");
var GameServerInfoConnection = (function () {
    function GameServerInfoConnection(gameServerAddress) {
        var _this = this;
        debug("Publishing preliminary status for " + gameServerAddress);
        this.pubSub = new PubSub_1["default"]();
        this.status = {
            address: gameServerAddress,
            healthy: false,
            info: {
                name: "Unable to Connect"
            }
        };
        this.publishStatus();
        debug("Initialising game server info connection to " + gameServerAddress);
        this.gameSocket = io(gameServerAddress, {
            reconnection: true,
            timeout: 2000
        });
        this.gameSocket.on("connect", function () {
            debug("Connected to " + gameServerAddress);
            _this.status.healthy = true;
            _this.publishStatus();
        });
        this.gameSocket.on("connect_failed", function () {
            debug("Connection to " + gameServerAddress + " failed");
            _this.status.healthy = false;
            _this.publishStatus();
        });
        this.gameSocket.on("error", function () {
            debug("Connection to " + gameServerAddress + " errored");
            _this.status.healthy = false;
            _this.publishStatus();
        });
        this.gameSocket.on(game_server_1.GAME_SOCKET_MESSAGE.GAME_INFO, function (gameInfo) {
            _this.status.info = gameInfo;
            _this.publishStatus();
        });
        this.gameSocket.on("disconnect", function () {
            debug("Connection to " + gameServerAddress + " lost!");
            _this.status.healthy = false;
            _this.publishStatus();
        });
    }
    GameServerInfoConnection.prototype.publishStatus = function () {
        this.pubSub.publish(Events_1.EVENTS.GAME_SERVER_UPDATE, this.status);
    };
    return GameServerInfoConnection;
}());
exports.GameServerInfoConnection = GameServerInfoConnection;
//# sourceMappingURL=GameServerInfoConnection.js.map