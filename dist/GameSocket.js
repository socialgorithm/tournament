"use strict";
exports.__esModule = true;
var GameSocketEvent;
(function (GameSocketEvent) {
    GameSocketEvent[GameSocketEvent["CreateMatch"] = 0] = "CreateMatch";
    GameSocketEvent[GameSocketEvent["MatchCreated"] = 1] = "MatchCreated";
    GameSocketEvent[GameSocketEvent["MatchUpdated"] = 2] = "MatchUpdated";
    GameSocketEvent[GameSocketEvent["MatchEnded"] = 3] = "MatchEnded";
    GameSocketEvent[GameSocketEvent["GameUpdated"] = 4] = "GameUpdated";
    GameSocketEvent[GameSocketEvent["GameEnded"] = 5] = "GameEnded";
    GameSocketEvent[GameSocketEvent["GameInfo"] = 6] = "GameInfo";
    GameSocketEvent[GameSocketEvent["GameServerHandoff"] = 7] = "GameServerHandoff";
    GameSocketEvent[GameSocketEvent["Game__Player"] = 8] = "Game__Player";
})(GameSocketEvent = exports.GameSocketEvent || (exports.GameSocketEvent = {}));
//# sourceMappingURL=GameSocket.js.map