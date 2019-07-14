"use strict";
exports.__esModule = true;
var EventName;
(function (EventName) {
    EventName[EventName["CreateMatch"] = 0] = "CreateMatch";
    EventName[EventName["MatchCreated"] = 1] = "MatchCreated";
    EventName[EventName["MatchUpdated"] = 2] = "MatchUpdated";
    EventName[EventName["MatchEnded"] = 3] = "MatchEnded";
    EventName[EventName["GameUpdated"] = 4] = "GameUpdated";
    EventName[EventName["GameEnded"] = 5] = "GameEnded";
    EventName[EventName["GameInfo"] = 6] = "GameInfo";
    EventName[EventName["GameList"] = 7] = "GameList";
    EventName[EventName["GameServerHandoff"] = 8] = "GameServerHandoff";
    EventName[EventName["GameServerStatusUpdate"] = 9] = "GameServerStatusUpdate";
    EventName[EventName["Game__Player"] = 10] = "Game__Player";
    EventName[EventName["PlayerDisconnected"] = 11] = "PlayerDisconnected";
    EventName[EventName["ServerToPlayer"] = 12] = "ServerToPlayer";
})(EventName = exports.EventName || (exports.EventName = {}));
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
//# sourceMappingURL=Events.js.map