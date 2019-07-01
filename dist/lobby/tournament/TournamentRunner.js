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
var debug = require("debug")("sg:tournamentRunner");
var Events_1 = require("../../Events");
var PubSub_1 = require("../../PubSub");
var MatchRunner_1 = require("./match/MatchRunner");
var DoubleEliminationMatchmaker_1 = require("./matchmaker/DoubleEliminationMatchmaker");
var FreeForAllMatchmaker_1 = require("./matchmaker/FreeForAllMatchmaker");
var TournamentRunner = (function () {
    function TournamentRunner(options, players, lobby) {
        var _this = this;
        this.matches = [];
        this.currentMatchRunner = null;
        this.getTournament = function () {
            return __assign({ matches: _this.matches }, _this.tournament);
        };
        this.start = function () {
            if (_this.tournament.started) {
                debug("Tournament already started, not starting %O", _this.getTournament());
                return;
            }
            _this.tournament.started = true;
            var matchOptions = {
                autoPlay: _this.tournament.options.autoPlay,
                maxGames: _this.tournament.options.numberOfGames,
                timeout: _this.tournament.options.timeout
            };
            switch (_this.tournament.options.type) {
                case "DoubleElimination":
                    _this.matchmaker = new DoubleEliminationMatchmaker_1["default"](_this.tournament.players, matchOptions);
                    break;
                case "FreeForAll":
                default:
                    _this.matchmaker = new FreeForAllMatchmaker_1["default"](_this.tournament.players, matchOptions);
                    break;
            }
            _this.matches = _this.matchmaker.getRemainingMatches();
            _this.pubSub.publish(Events_1.EVENTS.BROADCAST_NAMESPACED, {
                event: Events_1.EVENTS.LOBBY_TOURNAMENT_STARTED,
                namespace: _this.tournament.lobby,
                payload: {
                    tournament: _this.getTournament()
                }
            });
            if (_this.tournament.options.autoPlay) {
                _this["continue"]();
            }
        };
        this["continue"] = function () {
            _this.playNextMatch();
        };
        this.onTournamentEnd = function () {
            debug("Tournament Ended in %s", _this.tournament.lobby);
            _this.tournament.finished = true;
            _this.tournament.waiting = false;
            _this.matchmaker.updateStats(_this.matches, true);
            _this.sendStats();
        };
        this.onMatchEnd = function () {
            _this.tournament.waiting = !_this.tournament.options.autoPlay;
            _this.matchmaker.updateStats(_this.matches);
            _this.sendStats();
            if (_this.tournament.waiting) {
                return;
            }
            _this.playNextMatch();
        };
        this.playNextMatch = function () {
            var _a;
            if (_this.currentMatchRunner) {
                _this.currentMatchRunner.onEnd();
            }
            _this.tournament.ranking = _this.matchmaker.getRanking();
            if (_this.matchmaker.isFinished()) {
                _this.onTournamentEnd();
                return;
            }
            var upcomingMatches = _this.matches.filter(function (match) { return match.state === "upcoming"; });
            if (upcomingMatches.length < 1) {
                (_a = _this.matches).push.apply(_a, _this.matchmaker.getRemainingMatches());
                _this.playNextMatch();
                return;
            }
            var nextMatch = upcomingMatches[0];
            _this.currentMatchRunner = new MatchRunner_1.MatchRunner(nextMatch, _this.tournament.tournamentID, _this.tournament.options.gameServerAddress);
        };
        this.sendStats = function () {
            _this.pubSub.publish(Events_1.EVENTS.BROADCAST_NAMESPACED, {
                event: Events_1.EVENTS.TOURNAMENT_STATS,
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
        this.pubSub.subscribeNamespaced(this.tournament.tournamentID, Events_1.EVENTS.MATCH_ENDED, this.onMatchEnd);
        this.pubSub.subscribeNamespaced(this.tournament.tournamentID, Events_1.EVENTS.MATCH_UPDATE, this.sendStats);
    }
    return TournamentRunner;
}());
exports.TournamentRunner = TournamentRunner;
//# sourceMappingURL=TournamentRunner.js.map