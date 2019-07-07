"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:tournament-server");
var GameServerInfoConnection_1 = require("./game-server/GameServerInfoConnection");
var GameServerListPublisher_1 = require("./game-server/GameServerListPublisher");
var LobbyManager_1 = require("./lobby/LobbyManager");
var SocketServer_1 = require("./socket/SocketServer");
var TournamentServer = (function () {
    function TournamentServer(options) {
        console.log(banner);
        debug("Initialising game server connections");
        var gameServers = options.game.map(function (gameServerAddress) { return new GameServerInfoConnection_1.GameServerInfoConnection(gameServerAddress); });
        var gameServerListPublisher = new GameServerListPublisher_1.GameServerListPublisher();
        debug("Initialising socket");
        this.socketServer = new SocketServer_1.SocketServer(options.port, gameServers);
        this.socketServer.start();
        this.LobbyManager = new LobbyManager_1.LobbyManager();
    }
    return TournamentServer;
}());
exports["default"] = TournamentServer;
var banner = "\n                _       _                  _ _   _\n ___  ___   ___(_) __ _| | __ _  ___  _ __(_) |_| |__  _ __ ___\n/ __|/ _ \\ / __| |/ _` | |/ _` |/ _ \\| '__| | __| '_ \\| '_ ` _ \\\n\\__ \\ (_) | (__| | (_| | | (_| | (_) | |  | | |_| | | | | | | | |\n|___/\\___/ \\___|_|\\__,_|_|\\__, |\\___/|_|  |_|\\__|_| |_|_| |_| |_|\n                           |___/\n";
//# sourceMappingURL=TournamentServer.js.map