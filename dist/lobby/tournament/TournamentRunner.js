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
var MatchRunner_1 = require("./match/MatchRunner");
var DoubleEliminationMatchmaker_1 = require("./matchmaker/DoubleEliminationMatchmaker");
var FreeForAllMatchmaker_1 = require("./matchmaker/FreeForAllMatchmaker");
var TournamentRunner = (function () {
    function TournamentRunner(options, players, lobby) {
        var _this = this;
        this.matches = [];
        this.sendStats = function () {
            _this.pubSub.publish(events_1.EVENTS.BROADCAST_NAMESPACED, {
                event: events_1.EVENTS.TOURNAMENT_STATS,
                namespace: _this.tournament.lobby,
                payload: __assign({}, _this.getTournament())
            });
        };
        this.tournament = {
            finished: false,
            lobby: lobby,
            options: options,
            players: players,
            ranking: [],
            started: false,
            tournamentID: uuid(),
            waiting: !options.autoPlay
        };
        this.pubSub = new PubSub_1["default"]();
        this.pubSub.subscribeNamespaced(this.tournament.tournamentID, events_1.EVENTS.MATCH_ENDED, this.playNextMatch);
        this.pubSub.subscribeNamespaced(this.tournament.tournamentID, events_1.EVENTS.MATCH_UPDATE, this.sendStats);
    }
    TournamentRunner.prototype.getTournament = function () {
        return __assign({ matches: this.matches }, this.tournament);
    };
    TournamentRunner.prototype.start = function () {
        if (this.tournament.started) {
            console.log("Tournament already started, not starting", this.getTournament());
            return;
        }
        this.tournament.started = true;
        var matchOptions = {
            autoPlay: this.tournament.options.autoPlay,
            maxGames: this.tournament.options.numberOfGames,
            timeout: this.tournament.options.timeout
        };
        switch (this.tournament.options.type) {
            case "DoubleElimination":
                this.matchmaker = new DoubleEliminationMatchmaker_1["default"](this.tournament.players, matchOptions);
                break;
            case "FreeForAll":
            default:
                this.matchmaker = new FreeForAllMatchmaker_1["default"](this.tournament.players, matchOptions);
                break;
        }
        this.matches = this.matchmaker.getRemainingMatches();
        this.pubSub.publish(events_1.EVENTS.BROADCAST_NAMESPACED, {
            event: events_1.EVENTS.LOBBY_TOURNAMENT_STARTED,
            namespace: this.tournament.lobby,
            payload: {
                tournament: this.getTournament()
            }
        });
    };
    TournamentRunner.prototype["continue"] = function () {
        this.playNextMatch();
    };
    TournamentRunner.prototype.onTournamentEnd = function () {
        this.tournament.finished = true;
        this.tournament.waiting = false;
        this.sendStats();
    };
    TournamentRunner.prototype.playNextMatch = function () {
        var _a;
        this.sendStats();
        this.tournament.waiting = false;
        this.tournament.ranking = this.matchmaker.getRanking();
        if (this.matchmaker.isFinished()) {
            this.onTournamentEnd();
        }
        var upcomingMatches = this.matches.filter(function (match) { return match.state === "upcoming"; });
        if (upcomingMatches.length < 1) {
            (_a = this.matches).push.apply(_a, this.matchmaker.getRemainingMatches());
            this.playNextMatch();
            return;
        }
        var nextMatch = upcomingMatches[0];
        var matchRunner = new MatchRunner_1.MatchRunner(nextMatch, this.tournament.tournamentID);
        matchRunner.start();
    };
    return TournamentRunner;
}());
exports.TournamentRunner = TournamentRunner;
//# sourceMappingURL=TournamentRunner.js.map