"use strict";
exports.__esModule = true;
var uuid = require("uuid/v4");
var TournamentRunner = (function () {
    function TournamentRunner(options, players, lobbyToken) {
        this.options = options;
        this.players = players;
        this.lobbyToken = lobbyToken;
        this.tournament = {
            finished: false,
            matches: [],
            options: options,
            players: players,
            ranking: [],
            started: false,
            tournamentID: uuid()
        };
    }
    TournamentRunner.prototype.start = function () {
        console.log("Starting tournament", this.tournament, this.tournament.options);
        this.tournament.started = true;
    };
    TournamentRunner.prototype["continue"] = function () {
        console.log("tournament continued!");
    };
    return TournamentRunner;
}());
exports.TournamentRunner = TournamentRunner;
//# sourceMappingURL=TournamentRunner.js.map