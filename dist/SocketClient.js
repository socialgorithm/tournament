"use strict";
exports.__esModule = true;
var io = require("socket.io-client");
var Events_1 = require("./Events");
var SocketClient = (function () {
    function SocketClient(address) {
        this.socketIOSocket = io(address, {
            reconnection: true,
            timeout: 2000
        });
    }
    SocketClient.prototype.emit = function (event) {
        this.socketIOSocket.emit(Events_1.EventName[event.name], event.message);
    };
    SocketClient.prototype.addHandler = function (handler) {
        this.socketIOSocket.on(Events_1.EventName[handler.eventName], handler.handler);
    };
    return SocketClient;
}());
exports.SocketClient = SocketClient;
//# sourceMappingURL=SocketClient.js.map