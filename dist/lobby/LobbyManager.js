"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:lobbyManager");
var Events_1 = require("../events/Events");
var PubSub_1 = require("../pub-sub/PubSub");
var LobbyRunner_1 = require("./LobbyRunner");
var LobbyManager = (function () {
    function LobbyManager() {
        var _this = this;
        this.lobbyRunners = [];
        this.createLobby = function (data) {
            var admin = data.player;
            var lobbyRunner = new LobbyRunner_1.LobbyRunner(admin);
            _this.lobbyRunners.push(lobbyRunner);
            _this.pubSub.publish(Events_1.EVENTS.ADD_PLAYER_TO_NAMESPACE, {
                namespace: lobbyRunner.getLobby().token,
                player: data.player
            });
            debug("Created lobby %s", lobbyRunner.getLobby().token);
            _this.pubSub.publish(Events_1.EVENTS.SERVER_TO_PLAYER, {
                event: "lobby created",
                payload: {
                    lobby: lobbyRunner.getLobby()
                },
                player: data.player
            });
        };
        this.checkLobby = function (data) {
            var lobbyRunner = _this.lobbyRunners.find(function (each) { return each.getLobby().token === data.payload.token; });
            if (!lobbyRunner) {
                _this.pubSub.publish(Events_1.EVENTS.SERVER_TO_PLAYER, {
                    event: Events_1.EVENTS.LOBBY_EXCEPTION,
                    payload: {
                        error: "Unable to join lobby, ensure token is correct"
                    },
                    player: data.player
                });
            }
        };
        this.pubSub = new PubSub_1["default"]();
        this.pubSub.subscribe(Events_1.EVENTS.LOBBY_CREATE, this.createLobby);
        this.pubSub.subscribe(Events_1.EVENTS.LOBBY_JOIN, this.checkLobby);
    }
    return LobbyManager;
}());
exports.LobbyManager = LobbyManager;
//# sourceMappingURL=LobbyManager.js.map