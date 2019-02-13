"use strict";
exports.__esModule = true;
var uuid = require("uuid/v4");
var TournamentRunner = (function () {
    function TournamentRunner(options, players, lobbyToken) {
        this.options = options;
        this.players = players;
        this.lobbyToken = lobbyToken;
        this.tournament = {
            tournamentID: uuid(),
            players: players,
            started: false,
            finished: false,
            matches: [],
            type: options.type
        };
    }
    return TournamentRunner;
}());
exports.TournamentRunner = TournamentRunner;
//# sourceMappingURL=TournamentRunner.js.map