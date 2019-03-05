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
var uuid = require("uuid/v4");
var PubSub_1 = require("../../lib/PubSub");
var events_1 = require("../../socket/events");
var DoubleEliminationMatchmaker_1 = require("./matchmaker/DoubleEliminationMatchmaker");
var FreeForAllMatchmaker_1 = require("./matchmaker/FreeForAllMatchmaker");
var TournamentRunner = (function () {
    function TournamentRunner(options, players, lobby) {
        this.tournament = {
            finished: false,
            lobby: lobby,
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
        var matchOptions = {
            autoPlay: this.tournament.options.autoPlay,
            maxGames: this.tournament.options.numberOfGames,
            timeout: this.tournament.options.timeout
        };
        switch (this.tournament.options.type) {
            case "DoubleElimination":
                console.log("Doing Double Elim");
                this.matchmaker = new DoubleEliminationMatchmaker_1["default"](this.tournament.players, matchOptions);
                break;
            case "FreeForAll":
            default:
                console.log("Doing Default");
                this.matchmaker = new FreeForAllMatchmaker_1["default"](this.tournament.players, matchOptions);
                break;
        }
        var matches = this.matchmaker.getRemainingMatches();
        this.pubSub.publish(events_1.EVENTS.BROADCAST_NAMESPACED, {
            event: "lobby tournament started",
            namespace: this.tournament.lobby,
            payload: {
                tournament: __assign({ matches: matches }, this.tournament)
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