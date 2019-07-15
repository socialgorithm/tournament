"use strict";
exports.__esModule = true;
var CreateMatchEvent = (function () {
    function CreateMatchEvent(message) {
        this.message = message;
    }
    return CreateMatchEvent;
}());
exports.CreateMatchEvent = CreateMatchEvent;
var MatchCreatedEvent = (function () {
    function MatchCreatedEvent(message) {
        this.message = message;
    }
    return MatchCreatedEvent;
}());
exports.MatchCreatedEvent = MatchCreatedEvent;
var MatchEndedEvent = (function () {
    function MatchEndedEvent() {
    }
    return MatchEndedEvent;
}());
exports.MatchEndedEvent = MatchEndedEvent;
var GameEndedEvent = (function () {
    function GameEndedEvent(message) {
        this.message = message;
    }
    return GameEndedEvent;
}());
exports.GameEndedEvent = GameEndedEvent;
var GameServerHandoffEvent = (function () {
    function GameServerHandoffEvent(message) {
        this.message = message;
    }
    return GameServerHandoffEvent;
}());
exports.GameServerHandoffEvent = GameServerHandoffEvent;
var GameInfoEvent = (function () {
    function GameInfoEvent(message) {
        this.message = message;
    }
    return GameInfoEvent;
}());
exports.GameInfoEvent = GameInfoEvent;
var PlayerToGameEvent = (function () {
    function PlayerToGameEvent(message) {
        this.message = message;
    }
    return PlayerToGameEvent;
}());
exports.PlayerToGameEvent = PlayerToGameEvent;
var GameToPlayerEvent = (function () {
    function GameToPlayerEvent(message) {
        this.message = message;
    }
    return GameToPlayerEvent;
}());
exports.GameToPlayerEvent = GameToPlayerEvent;
var GameListEvent = (function () {
    function GameListEvent(message) {
        this.message = message;
    }
    return GameListEvent;
}());
exports.GameListEvent = GameListEvent;
var PlayerDisconnectedEvent = (function () {
    function PlayerDisconnectedEvent(message) {
        this.message = message;
    }
    return PlayerDisconnectedEvent;
}());
exports.PlayerDisconnectedEvent = PlayerDisconnectedEvent;
//# sourceMappingURL=Events.js.map