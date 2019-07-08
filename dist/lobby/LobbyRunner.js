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
var randomWord = require("random-word");
var debug = require("debug")("sg:lobbyRunner");
var Events_1 = require("../events/Events");
var PubSub_1 = require("../pub-sub/PubSub");
var TournamentRunner_1 = require("./tournament/TournamentRunner");
var LobbyRunner = (function () {
    function LobbyRunner(admin) {
        var _this = this;
        this.adminConnected = false;
        this.addPlayerToLobby = function (data) {
            var player = data.player;
            var lobbyName = data.payload.token;
            var isSpectating = data.payload.spectating;
            if (lobbyName !== _this.lobby.token) {
                return;
            }
            if (_this.lobby.bannedPlayers.indexOf(player) > -1) {
                return;
            }
            if (_this.lobby.admin === player) {
                debug("Setting admin connected in " + _this.lobby);
                _this.adminConnected = true;
            }
            if (!isSpectating && _this.lobby.players.indexOf(player) < 0) {
                _this.lobby.players.push(player);
            }
            var lobby = _this.getLobby();
            _this.pubSub.publish(Events_1.EVENTS.ADD_PLAYER_TO_NAMESPACE, {
                namespace: lobbyName,
                player: player
            });
            _this.pubSub.publish(Events_1.EVENTS.BROADCAST_NAMESPACED, {
                event: "connected",
                namespace: lobbyName,
                payload: {
                    lobby: lobby
                }
            });
            _this.pubSub.publish(Events_1.EVENTS.SERVER_TO_PLAYER, {
                event: "lobby joined",
                payload: {
                    isAdmin: _this.lobby.admin === player,
                    lobby: lobby
                },
                player: player
            });
            if (isSpectating) {
                _this.pubSub.publish(Events_1.EVENTS.ADD_PLAYER_TO_NAMESPACE, {
                    namespace: lobbyName + "-info",
                    player: player
                });
            }
            debug("Added player %s to lobby %s", player, lobbyName);
        };
        this.removeDisconnectedPlayer = function (data) {
            var disconnectedPlayer = data.player;
            var lobby = _this.getLobby();
            var foundIndex = _this.lobby.players.indexOf(disconnectedPlayer);
            if (foundIndex > -1) {
                debug("Removing " + disconnectedPlayer + " from " + lobby.token);
                _this.lobby.players.splice(foundIndex, 1);
                _this.pubSub.publish(Events_1.EVENTS.BROADCAST_NAMESPACED, {
                    event: "lobby player disconnected",
                    namespace: lobby.token,
                    payload: {
                        lobby: lobby
                    }
                });
            }
            if (disconnectedPlayer === lobby.admin) {
                debug("Setting admin disconnected in " + _this.lobby);
                _this.adminConnected = false;
            }
        };
        this.ifAdmin = function (next) { return function (data) {
            var lobbyName = data.payload.token;
            if (data.player !== _this.lobby.admin || lobbyName !== _this.lobby.token) {
                return;
            }
            next(lobbyName, data);
        }; };
        this.startTournament = this.ifAdmin(function (lobbyName, data) {
            if (_this.tournamentRunner) {
                _this.tournamentRunner.destroy();
            }
            _this.tournamentRunner = new TournamentRunner_1.TournamentRunner(data.payload.options, _this.lobby.players, _this.lobby.token);
            debug("Starting tournament in lobby %s", lobbyName);
            _this.tournamentRunner.start();
        });
        this.continueTournament = this.ifAdmin(function (lobbyName) {
            _this.tournamentRunner["continue"]();
            debug("Continue tournament in lobby %s", lobbyName);
            _this.pubSub.publish(Events_1.EVENTS.BROADCAST_NAMESPACED, {
                event: "lobby tournament continued",
                namespace: lobbyName,
                payload: _this.getLobby()
            });
        });
        this.kickPlayer = this.ifAdmin(function (lobbyName, data) {
            var playerIndex = _this.lobby.players.indexOf(data.player);
            _this.lobby.players.splice(playerIndex, 1);
            debug("Kick player %s in lobby %s", data.player, lobbyName);
            _this.pubSub.publish(Events_1.EVENTS.BROADCAST_NAMESPACED, {
                event: "lobby player kicked",
                namespace: lobbyName,
                payload: _this.getLobby()
            });
            _this.pubSub.publish(Events_1.EVENTS.SERVER_TO_PLAYER, {
                event: "kicked",
                payload: null,
                player: data.player
            });
        });
        this.banPlayer = this.ifAdmin(function (lobbyName, data) {
            var playerIndex = _this.lobby.players.indexOf(data.player);
            _this.lobby.players.splice(playerIndex, 1);
            if (_this.lobby.bannedPlayers.indexOf(data.player) > -1) {
                return;
            }
            _this.lobby.bannedPlayers.push(data.player);
            debug("Ban player %s in lobby %s", data.player, lobbyName);
            _this.pubSub.publish(Events_1.EVENTS.BROADCAST_NAMESPACED, {
                event: "lobby player banned",
                namespace: lobbyName,
                payload: _this.getLobby()
            });
            _this.pubSub.publish(Events_1.EVENTS.SERVER_TO_PLAYER, {
                event: "banned",
                payload: null,
                player: data.player
            });
        });
        this.lobby = {
            admin: admin,
            bannedPlayers: [],
            players: [],
            token: randomWord() + "-" + randomWord()
        };
        this.pubSub = new PubSub_1["default"]();
        this.pubSub.subscribe(Events_1.EVENTS.LOBBY_JOIN, this.addPlayerToLobby);
        this.pubSub.subscribe(Events_1.EVENTS.LOBBY_TOURNAMENT_START, this.startTournament);
        this.pubSub.subscribe(Events_1.EVENTS.LOBBY_TOURNAMENT_CONTINUE, this.continueTournament);
        this.pubSub.subscribe(Events_1.EVENTS.LOBBY_PLAYER_BAN, this.banPlayer);
        this.pubSub.subscribe(Events_1.EVENTS.LOBBY_PLAYER_KICK, this.kickPlayer);
        this.pubSub.subscribe(Events_1.EVENTS.PLAYER_DISCONNECTED, this.removeDisconnectedPlayer);
        var expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 6);
        this.expiresAt = expiresAt;
    }
    LobbyRunner.prototype.getLobby = function () {
        var tournament = this.tournamentRunner ? this.tournamentRunner.getTournament() : null;
        return __assign({ tournament: tournament }, this.lobby);
    };
    LobbyRunner.prototype.isExpired = function () {
        var now = new Date();
        return now > this.expiresAt;
    };
    LobbyRunner.prototype.isInactive = function () {
        return this.lobby.players.length === 0 && !this.adminConnected;
    };
    LobbyRunner.prototype.destroy = function () {
        if (this.tournamentRunner) {
            this.tournamentRunner.destroy();
        }
        this.pubSub.unsubscribeAll();
    };
    return LobbyRunner;
}());
exports.LobbyRunner = LobbyRunner;
//# sourceMappingURL=LobbyRunner.js.map