"use strict";
exports.__esModule = true;
var socketServer_1 = require("./socket/socketServer");
var banner_1 = require("./lib/banner");
var LobbyManager_1 = require("./lobby/LobbyManager");
var Server = (function () {
    function Server(options) {
        this.socketServer = new socketServer_1.SocketServer(options.port);
        this.LobbyManager = new LobbyManager_1.LobbyManager();
        this.start();
    }
    Server.prototype.start = function () {
        console.log(banner_1.banner);
        this.socketServer.start();
    };
    Server.prototype.log = function (message) {
        var time = (new Date()).toTimeString().substr(0, 5);
        console.log("[" + time + "]", message);
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map