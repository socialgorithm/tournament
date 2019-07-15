"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:socketServer");
var model_1 = require("@socialgorithm/model");
var fs = require("fs");
var http = require("http");
var io = require("socket.io");
var pub_sub_1 = require("../pub-sub");
var PubSub_1 = require("../pub-sub/PubSub");
var SocketServer = (function () {
    function SocketServer(port, gameServers) {
        var _this = this;
        this.port = port;
        this.gameServers = gameServers;
        this.playerSockets = {};
        this.addPlayerToNamespace = function (data) {
            if (!_this.playerSockets[data.player]) {
                debug("Error adding player (%s) to namespace, player socket does not exist", data.player);
                return;
            }
            _this.playerSockets[data.player].join(data.namespace);
            _this.playerSockets[data.player].emit(model_1.EventName.GameList, _this.gameServers.map(function (server) { return server.status; }));
        };
        this.sendMessageToNamespace = function (data) {
            _this.io["in"](data.namespace).emit(data.event, data.payload);
        };
        this.sendMessageToPlayer = function (data) {
            var socket = _this.playerSockets[data.player];
            if (!socket) {
                debug("Error sending message to player (%s), player socket does not exist", data.player);
                return;
            }
            socket.emit(data.event, data.payload);
        };
        this.sendGameListToEveryone = function (data) {
            debug("Game server list updated, publishing update: %O", data);
            Object.values(_this.playerSockets).forEach(function (socket) {
                socket.emit(model_1.EventName.GameList, data);
            });
        };
        this.onMessageFromSocket = function (player, event) { return function (payload) {
            var data = {
                payload: payload,
                player: player
            };
            _this.pubSub.publish(_this.translateSocketMessageToPubSub(event), data);
        }; };
        this.onPlayerDisconnect = function (player) { return function () {
            debug("Removing player (%s) from server", player);
            delete _this.playerSockets[player];
            _this.pubSub.publish(pub_sub_1.Events.PlayerDisconnected, { player: player });
        }; };
        this.pubSub = new PubSub_1["default"]();
    }
    SocketServer.prototype.start = function () {
        var _this = this;
        var app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(this.port);
        console.log("Socket Listening on port: " + this.port);
        debug("Socket Listening on port: %d", this.port);
        this.io.use(function (socket, next) {
            var isClient = socket.request._query.client || false;
            if (isClient) {
                return next();
            }
            var token = socket.request._query.token;
            if (!token) {
                return next(new Error("Missing token"));
            }
            next();
        });
        this.io.on("connection", function (socket) {
            var token = socket.handshake.query.token;
            var player = token;
            if (_this.playerSockets[player]) {
                debug("Player already connected %s", player);
                return false;
            }
            debug("Connected %s", player);
            _this.playerSockets[token] = socket;
            var listenToEvents = [
                model_1.LegacyEvents.EVENTS.LOBBY_CREATE,
                model_1.LegacyEvents.EVENTS.LOBBY_TOURNAMENT_START,
                model_1.LegacyEvents.EVENTS.LOBBY_TOURNAMENT_CONTINUE,
                model_1.LegacyEvents.EVENTS.LOBBY_JOIN,
                model_1.LegacyEvents.EVENTS.LOBBY_PLAYER_BAN,
                model_1.LegacyEvents.EVENTS.LOBBY_PLAYER_KICK,
            ];
            listenToEvents.forEach(function (event) {
                socket.on(event, _this.onMessageFromSocket(player, event));
            });
            socket.on("disconnect", _this.onPlayerDisconnect(player));
        });
        this.pubSub.subscribe(pub_sub_1.Events.ServerToPlayer, this.sendMessageToPlayer);
        this.pubSub.subscribe(pub_sub_1.Events.BroadcastNamespaced, this.sendMessageToNamespace);
        this.pubSub.subscribe(pub_sub_1.Events.AddPlayerToNamespace, this.addPlayerToNamespace);
        this.pubSub.subscribe(pub_sub_1.Events.GameList, this.sendGameListToEveryone);
    };
    SocketServer.prototype.translateSocketMessageToPubSub = function (socketEvent) {
        switch (socketEvent) {
            case model_1.LegacyEvents.EVENTS.LOBBY_CREATE:
                return pub_sub_1.Events.LobbyCreate;
            case model_1.LegacyEvents.EVENTS.LOBBY_TOURNAMENT_START:
                return pub_sub_1.Events.LobbyTournamentStart;
            case model_1.LegacyEvents.EVENTS.LOBBY_TOURNAMENT_CONTINUE:
                return pub_sub_1.Events.LobbyTournamentContinue;
            case model_1.LegacyEvents.EVENTS.LOBBY_JOIN:
                return pub_sub_1.Events.LobbyJoin;
            case model_1.LegacyEvents.EVENTS.LOBBY_PLAYER_BAN:
                return pub_sub_1.Events.LobbyPlayerBan;
            case model_1.LegacyEvents.EVENTS.LOBBY_PLAYER_KICK:
                return pub_sub_1.Events.LobbyPlayerKick;
        }
    };
    SocketServer.prototype.handler = function (req, res) {
        fs.readFile(__dirname + "/../../public/index.html", function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end("Error loading index.html");
            }
            res.writeHead(200);
            res.end(data);
        });
    };
    return SocketServer;
}());
exports.SocketServer = SocketServer;
//# sourceMappingURL=SocketServer.js.map