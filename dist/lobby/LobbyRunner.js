"use strict";
exports.__esModule = true;
var randomWord = require("random-word");
var LobbyRunner = (function () {
    function LobbyRunner(admin) {
        this.lobby = {
            admin: admin,
            name: randomWord() + "-" + randomWord(),
            players: [],
            bannedPlayers: []
        };
    }
    return LobbyRunner;
}());
exports.LobbyRunner = LobbyRunner;
//# sourceMappingURL=LobbyRunner.js.map