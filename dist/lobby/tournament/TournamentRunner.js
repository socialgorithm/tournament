"use strict";
exports.__esModule = true;
var uuid = require("uuid/v4");
var PubSub_1 = require("../../lib/PubSub");
var events_1 = require("../../socket/events");
var TournamentRunner = (function () {
    function TournamentRunner(options, players, lobby) {
        this.options = options;
        this.players = players;
        this.tournament = {
            finished: false,
            lobby: lobby,
            matches: [],
            options: options,
            players: players,
            ranking: [],
            started: false,
            tournamentID: uuid()
        };
        this.pubSub = new PubSub_1["default"]();
    }
    TournamentRunner.prototype.start = function () {
        console.log("Starting tournament", this.tournament, this.tournament.options);
        this.tournament.started = true;
        this.pubSub.publish(events_1.EVENTS.BROADCAST_NAMESPACED, {
            event: "lobby tournament started",
            namespace: this.tournament.lobby,
            payload: {
                tournament: this.tournament
            }
        });
    };
    TournamentRunner.prototype["continue"] = function () {
        console.log("tournament continued!");
    };
    return TournamentRunner;
}());
exports.TournamentRunner = TournamentRunner;
//# sourceMappingURL=TournamentRunner.js.map