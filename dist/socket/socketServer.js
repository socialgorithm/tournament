"use strict";
exports.__esModule = true;
var fs = require("fs");
var http = require("http");
var io = require("socket.io");
var SocketServer = (function () {
    function SocketServer() {
    }
    SocketServer.prototype.start = function () {
        var port = 3333;
        var app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(port);
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
    };
    SocketServer.prototype.onSocketMessage = function () {
    };
    SocketServer.prototype.onPubSubMessage = function () {
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