"use strict";
exports.__esModule = true;
var RESULT_TIE = -1;
var DoubleEliminationMatchmaker = (function () {
    function DoubleEliminationMatchmaker(players, options) {
        var _this = this;
        this.players = players;
        this.options = options;
        this.unlinkedMatches = [];
        this.allMatches = [];
        this.processedMatches = [];
        this.ranking = this.players.map(function (player) { return player; });
        this.playerStats = {};
        this.players.forEach(function (player) {
            _this.playerStats[player] = { player: player, wins: 0, losses: 0 };
        });
        this.waitingForFinal = [];
    }
    DoubleEliminationMatchmaker.prototype.isFinished = function () {
        return this.finished;
    };
    DoubleEliminationMatchmaker.prototype.updateStats = function (allMatches) {
        var _this = this;
        this.allMatches = allMatches;
        var justPlayedMatches = this.allMatches.filter(function (match) {
            return _this.processedMatches.indexOf(match.matchID) === -1;
        });
        var tiedMatches = 0;
        justPlayedMatches.forEach(function (match) {
        });
        var tournamentFinished = allMatches.every(function (match) { return match.state === "finished"; });
        if (!tournamentFinished) {
            this.ranking = this.unfinishedRanking();
        }
        if (tiedMatches < 1 && justPlayedMatches.length === 1 && !this.anyPlayersWaiting()) {
            this.finished = true;
            this.ranking = this.finishedRanking();
        }
    };
    DoubleEliminationMatchmaker.prototype.getRemainingMatches = function () {
        var _this = this;
        var matches = [];
        if (this.allMatches.length === 0) {
            var matchResult = this.matchPlayers(this.players);
            this.zeroLossOddPlayer = matchResult.oddPlayer;
            return matchResult.matches;
        }
        var justPlayedMatches = this.allMatches.filter(function (match) {
            return _this.processedMatches.indexOf(match.matchID) === -1;
        });
        var tiedPlayers = [];
        justPlayedMatches.forEach(function (match) {
            _this.processedMatches.push(match.matchID);
        });
        if (matches.length < 1 && justPlayedMatches.length === 1 && !this.anyPlayersWaiting()) {
            this.finished = true;
            this.ranking = this.finishedRanking();
            return [];
        }
        var zeroLossPlayers = [];
        var oneLossPlayers = [];
        Object.keys(this.playerStats).forEach(function (playerToken) {
            var stats = _this.playerStats[playerToken];
            if (!_this.playerIsWaitingForMatch(stats.player) && tiedPlayers.indexOf(stats.player) === -1) {
                if (stats.losses === 0) {
                    zeroLossPlayers.push(stats.player);
                }
                else if (stats.losses === 1) {
                    oneLossPlayers.push(stats.player);
                }
            }
        });
        if (this.zeroLossOddPlayer != null) {
            zeroLossPlayers.unshift(this.zeroLossOddPlayer);
            delete this.zeroLossOddPlayer;
        }
        if (this.oneLossOddPlayer != null) {
            oneLossPlayers.unshift(this.oneLossOddPlayer);
            delete this.oneLossOddPlayer;
        }
        if (zeroLossPlayers.length > 1) {
            var matchResult = this.matchPlayers(zeroLossPlayers);
            matches.push.apply(matches, matchResult.matches);
            this.zeroLossOddPlayer = matchResult.oddPlayer;
        }
        else if (zeroLossPlayers.length === 1) {
            this.waitingForFinal.push(zeroLossPlayers[0]);
        }
        if (oneLossPlayers.length > 1) {
            var matchResult = this.matchPlayers(oneLossPlayers);
            matches.push.apply(matches, matchResult.matches);
            this.oneLossOddPlayer = matchResult.oddPlayer;
        }
        else if (oneLossPlayers.length === 1) {
            this.waitingForFinal.push(oneLossPlayers[0]);
        }
        if (this.waitingForFinal.length > 1) {
            var matchResult = this.matchPlayers(this.waitingForFinal);
            matches.push.apply(matches, matchResult.matches);
            this.waitingForFinal = [];
        }
        return matches;
    };
    DoubleEliminationMatchmaker.prototype.getRanking = function () {
        return this.ranking;
    };
    DoubleEliminationMatchmaker.prototype.finishedRanking = function () {
        var ranking = [];
        var matches = this.allMatches.map(function (match) { return match; });
        matches.reverse().forEach(function (match) {
        });
        var playersAwaitingMatch = this.players.map(function (player) { return player; }).filter(function (token) { return ranking.indexOf(token) === -1; });
        ranking.push.apply(ranking, playersAwaitingMatch);
        return ranking;
    };
    DoubleEliminationMatchmaker.prototype.unfinishedRanking = function () {
        var _this = this;
        return this.players
            .map(function (player) { return player; })
            .sort(function (a, b) { return _this.getPlayerScore(b) - _this.getPlayerScore(a); }).map(function (player) { return player; });
    };
    DoubleEliminationMatchmaker.prototype.getPlayerScore = function (player) {
        return this.playerStats[player].wins / (this.playerStats[player].wins + this.playerStats[player].losses);
    };
    DoubleEliminationMatchmaker.prototype.matchPlayers = function (players) {
        var matches = [];
        var oddPlayer;
        if (players.length < 2) {
            return {};
        }
        if (players.length % 2 !== 0) {
            oddPlayer = players[players.length - 1];
            players = players.slice(0, -1);
        }
        for (var i = 0; i < players.length; i += 2) {
            var playerA = players[i];
            var playerB = players[i + 1];
            matches.push(this.createMatch(playerA, playerB));
        }
        return { matches: matches, oddPlayer: oddPlayer };
    };
    DoubleEliminationMatchmaker.prototype.createMatch = function (playerA, playerB, optionOverrides, parentMatches) {
        var finalOptions = Object.assign(this.options, optionOverrides || {});
        var match = {
            games: [],
            matchID: "",
            parentMatches: parentMatches,
            players: [playerA, playerB],
            state: "upcoming",
            winner: -1
        };
        if (parentMatches) {
            match.parentMatches = parentMatches;
        }
        else {
            this.setParentMatches(match);
        }
        this.unlinkedMatches.push(match);
        return match;
    };
    DoubleEliminationMatchmaker.prototype.playerIsWaitingForMatch = function (player) {
        return this.waitingForFinal.indexOf(player) >= 0 || player === this.zeroLossOddPlayer || player === this.oneLossOddPlayer;
    };
    DoubleEliminationMatchmaker.prototype.anyPlayersWaiting = function () {
        return this.waitingForFinal.length > 0 || !!this.zeroLossOddPlayer || !!this.oneLossOddPlayer;
    };
    DoubleEliminationMatchmaker.prototype.setParentMatches = function (match) {
    };
    return DoubleEliminationMatchmaker;
}());
exports["default"] = DoubleEliminationMatchmaker;
//# sourceMappingURL=DoubleEliminationMatchmaker.js.map