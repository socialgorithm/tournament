"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var PubSub_1 = require("../lib/PubSub");
var events_1 = require("../lib/events");
var LobbyRunner_1 = require("./LobbyRunner");
var LobbyManager = (function () {
    function LobbyManager() {
        var _this = this;
        this.lobbyRunners = [];
        this.createLobby = function (data) {
            var admin = data.player;
            var lobbyRunner = new LobbyRunner_1.LobbyRunner(admin);
            _this.lobbyRunners.push(lobbyRunner);
            _this.pubSub.publish(events_1.EVENTS.ADD_PLAYER_TO_NAMESPACE, {
                player: data.player,
                namespace: lobbyRunner.lobby.token
            });
            _this.pubSub.publish(events_1.EVENTS.SERVER_TO_PLAYER, {
                player: data.player,
                event: 'lobby created',
                payload: {
                    lobby: __assign({ tournament: lobbyRunner.tournamentRunner.tournament }, lobbyRunner.lobby)
                }
            });
        };
        this.pubSub = new PubSub_1["default"]();
        this.pubSub.subscribe(events_1.EVENTS.LOBBY_CREATE, this.createLobby);
    }
    return LobbyManager;
}());
exports.LobbyManager = LobbyManager;
//# sourceMappingURL=LobbyManager.js.map