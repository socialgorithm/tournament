"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:gameServerInfoConnection");
var io = require("socket.io-client");
var game_server_1 = require("@socialgorithm/game-server");
var GameServerInfoConnection = (function () {
    function GameServerInfoConnection(gameServerAddress) {
        var _this = this;
        this.healthy = false;
        debug("Initialising game server info connection to %s", gameServerAddress);
        this.gameSocket = io(gameServerAddress, {
            reconnection: true,
            timeout: 2000
        });
        this.gameSocket.on("connect", function () {
            debug("Connected to Game Server");
        });
        this.gameSocket.on(game_server_1.GAME_SOCKET_MESSAGE.GAME_INFO, function (gameInfo) {
            _this.gameInfo = gameInfo;
            _this.healthy = true;
        });
        this.gameSocket.on("disconnect", function () {
            debug("Connection to Game Server %s lost!", gameServerAddress);
            _this.healthy = false;
        });
    }
    return GameServerInfoConnection;
}());
exports.GameServerInfoConnection = GameServerInfoConnection;
//# sourceMappingURL=GameServerInfoConnection.js.map