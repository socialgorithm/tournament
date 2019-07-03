"use strict";
exports.__esModule = true;
var fs = require("fs");
var http = require("http");
var io = require("socket.io");
var debug = require("debug")("sg:socketServer");
var Events_1 = require("../Events");
var PubSub_1 = require("../PubSub");
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
            _this.playerSockets[data.player].emit(Events_1.EVENTS.GAME_LIST, _this.gameServers.map(function (server) { return server.status; }));
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
        this.onMessageFromSocket = function (player, type) { return function (payload) {
            var data = {
                payload: payload,
                player: player
            };
            _this.pubSub.publish(type, data);
        }; };
        this.onPlayerDisconnect = function (player) { return function () {
            debug("Removing player (%s) from server", player);
            delete _this.playerSockets[player];
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
                Events_1.EVENTS.LOBBY_CREATE,
                Events_1.EVENTS.LOBBY_TOURNAMENT_START,
                Events_1.EVENTS.LOBBY_TOURNAMENT_CONTINUE,
                Events_1.EVENTS.LOBBY_JOIN,
                Events_1.EVENTS.LOBBY_PLAYER_BAN,
                Events_1.EVENTS.LOBBY_PLAYER_KICK,
            ];
            listenToEvents.forEach(function (event) {
                socket.on(event, _this.onMessageFromSocket(player, event));
            });
            socket.on("game", function (data) { return _this.pubSub.publish(Events_1.EVENTS.PLAYER_TO_GAME, { player: player, data: data }); });
            socket.on("disconnect", _this.onPlayerDisconnect(player));
        });
        this.pubSub.subscribe(Events_1.EVENTS.SERVER_TO_PLAYER, this.sendMessageToPlayer);
        this.pubSub.subscribe(Events_1.EVENTS.BROADCAST_NAMESPACED, this.sendMessageToNamespace);
        this.pubSub.subscribe(Events_1.EVENTS.ADD_PLAYER_TO_NAMESPACE, this.addPlayerToNamespace);
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