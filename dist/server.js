"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:tournament-server");
var GameServerInfoConnection_1 = require("./game-server/GameServerInfoConnection");
var banner_1 = require("./lib/banner");
var LobbyManager_1 = require("./lobby/LobbyManager");
var socketServer_1 = require("./socket/socketServer");
var TournamentServer = (function () {
    function TournamentServer(options) {
        console.log(banner_1.banner);
        debug("Initialising socket");
        this.socketServer = new socketServer_1.SocketServer(options.port);
        this.socketServer.start();
        debug("Initialising game server connections");
        this.gameServers = options.game.map(function (gameServerAddress) { return new GameServerInfoConnection_1.GameServerInfoConnection(gameServerAddress); });
        this.LobbyManager = new LobbyManager_1.LobbyManager();
    }
    return TournamentServer;
}());
exports["default"] = TournamentServer;
//# sourceMappingURL=server.js.map