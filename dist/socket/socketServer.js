"use strict";
exports.__esModule = true;
var fs = require("fs");
var http = require("http");
var io = require("socket.io");
var PubSub_1 = require("../lib/PubSub");
var events_1 = require("./events");
var SocketServer = (function () {
    function SocketServer(port) {
        var _this = this;
        this.port = port;
        this.playerSockets = {};
        this.addPlayerToNamespace = function (data) {
            if (!_this.playerSockets[data.player]) {
                console.warn("Error adding player to namespace, player socket does not exist", data.player);
                return;
            }
            _this.playerSockets[data.player].join(data.namespace);
        };
        this.sendMessageToNamespace = function (data) {
            _this.io["in"](data.namespace).emit(data.event, data.payload);
        };
        this.sendMessageToPlayer = function (data) {
            if (!_this.playerSockets[data.player]) {
                console.error("Error sending message to player, player socket does not exist", data.player);
                return;
            }
            _this.playerSockets[data.player].emit(data.event, data.payload);
        };
        this.onMessageFromSocket = function (player, type) { return function (payload) {
            var data = {
                payload: payload,
                player: player
            };
            _this.pubSub.publish(type, data);
        }; };
        this.onPlayerDisconnect = function (player) { return function () {
            console.log("Removing " + player + " from server");
            delete _this.playerSockets[player];
        }; };
        this.pubSub = new PubSub_1["default"]();
    }
    SocketServer.prototype.start = function () {
        var _this = this;
        var app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(this.port);
        console.log("Socket Listening on port " + this.port);
        this.io.use(function (socket, next) {
            var isClient = socket.request._query.client || false;
            if (isClient) {
                return next();
            }
            var token = socket.request._query.token;
            if (!token) {
                return next(new Error("Missing token"));
            }
            socket.request.testToken = token;
            next();
        });
        this.io.on("connection", function (socket) {
            var token = socket.handshake.query.token;
            var player = token;
            if (_this.playerSockets[player]) {
                console.warn("Player already connected", player);
                return false;
            }
            console.log("Connected ", player);
            _this.playerSockets[token] = socket;
            var listenToEvents = [
                events_1.EVENTS.LOBBY_CREATE,
                events_1.EVENTS.LOBBY_TOURNAMENT_START,
                events_1.EVENTS.LOBBY_TOURNAMENT_CONTINUE,
                events_1.EVENTS.LOBBY_JOIN,
                events_1.EVENTS.LOBBY_PLAYER_BAN,
                events_1.EVENTS.LOBBY_PLAYER_KICK,
            ];
            listenToEvents.forEach(function (event) {
                socket.on(event, _this.onMessageFromSocket(player, event));
            });
            socket.on("game", function (data) { return _this.pubSub.publish(events_1.EVENTS.PLAYER_TO_GAME, { player: player, data: data }); });
            socket.on("disconnect", _this.onPlayerDisconnect(player));
        });
        this.pubSub.subscribe(events_1.EVENTS.SERVER_TO_PLAYER, this.sendMessageToPlayer);
        this.pubSub.subscribe(events_1.EVENTS.BROADCAST_NAMESPACED, this.sendMessageToNamespace);
        this.pubSub.subscribe(events_1.EVENTS.ADD_PLAYER_TO_NAMESPACE, this.addPlayerToNamespace);
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
//# sourceMappingURL=socketServer.js.map