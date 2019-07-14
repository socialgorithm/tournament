"use strict";
exports.__esModule = true;
var Events_1 = require("./Events");
var Socket = (function () {
    function Socket(socket) {
        this.socket = socket;
    }
    Socket.prototype.emit = function (event) {
        this.socket.emit(Events_1.EventName[event.name], event.message);
    };
    Socket.prototype.addHandler = function (handler) {
        this.socket.on(Events_1.EventName[handler.eventName], handler.handler);
    };
    return Socket;
}());
exports.Socket = Socket;
//# sourceMappingURL=Socket.js.map