"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var uuid_1 = require("uuid");
var RESULT_TIE = -1;
var DoubleEliminationMatchmaker = (function () {
    function DoubleEliminationMatchmaker(players, options) {
        var _this = this;
        this.options = options;
        this.unlinkedMatches = [];
        this.players = this.shufflePlayers(players);
        this.playedMatches = [];
        this.processedMatches = [];
        this.ranking = this.players.map(function (player) { return player; });
        this.playerStats = {};
        this.players.forEach(function (player) {
            _this.playerStats[player] = { player: player, wins: 0, losses: 0 };
        });
        this.waitingForFinal = [];
    }
    DoubleEliminationMatchmaker.prototype.shufflePlayers = function (_a) {
        var _b;
        var players = _a.slice(0);
        var m = players.length;
        while (m) {
            var i = Math.floor(Math.random() * m--);
            _b = [players[i], players[m]], players[m] = _b[0], players[i] = _b[1];
        }
        return players;
    };
    DoubleEliminationMatchmaker.prototype.isFinished = function () {
        return this.finished;
    };
    DoubleEliminationMatchmaker.prototype.updateStats = function (playedMatches, tournamentFinished) {
        var _this = this;
        if (tournamentFinished === void 0) { tournamentFinished = false; }
        this.playedMatches = playedMatches;
        var justPlayedMatches = this.playedMatches.filter(function (match) {
            return _this.processedMatches.indexOf(match.matchID) === -1;
        });
        var tiedMatches = 0;
        justPlayedMatches.forEach(function (match) {
            if (match.winner !== RESULT_TIE) {
                var winner = match.players[match.winner];
                var loser = match.players[match.winner === 1 ? 0 : 1];
                _this.playerStats[winner].wins++;
                _this.playerStats[loser].losses++;
            }
            else {
                tiedMatches++;
            }
        });
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
        if (this.playedMatches.length === 0) {
            var matchResult = this.matchPlayers(this.players);
            this.zeroLossOddPlayer = matchResult.oddPlayer;
            return matchResult.matches;
        }
        var justPlayedMatches = this.playedMatches.filter(function (match) {
            return _this.processedMatches.indexOf(match.matchID) === -1;
        });
        var tiedPlayers = [];
        justPlayedMatches.forEach(function (match) {
            _this.processedMatches.push(match.matchID);
            if (match.winner === RESULT_TIE) {
                matches.push(_this.createMatch(match.players[0], match.players[1], { timeout: match.options.timeout / 2 }, [{ playerIndex: 0, parent: match.matchID }, { playerIndex: 1, parent: match.matchID }]));
                tiedPlayers.push.apply(tiedPlayers, match.players);
            }
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
        var matches = this.playedMatches.map(function (match) { return match; });
        matches.reverse().forEach(function (match) {
            if (match.winner !== RESULT_TIE) {
                var winner = match.players[match.winner];
                var loser = match.players[match.winner === 1 ? 0 : 1];
                if (ranking.indexOf(winner) === -1) {
                    ranking.push(winner);
                }
                if (ranking.indexOf(loser) === -1) {
                    ranking.push(loser);
                }
            }
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
        if (this.playerStats[player].wins + this.playerStats[player].losses < 1) {
            return 0;
        }
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
            matchID: (0, uuid_1.v4)(),
            messages: [],
            options: finalOptions,
            parentMatches: parentMatches,
            players: [playerA, playerB],
            state: "upcoming",
            winner: -1,
            stats: {
                gamesCompleted: 0,
                gamesTied: 0,
                wins: []
            }
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
        var _this = this;
        var playerTokens = match.players.map(function (player) { return player; });
        var parentMatches = this.unlinkedMatches.filter(function (eachMatch) {
            var winner = eachMatch.players[eachMatch.winner];
            if (!winner) {
                return false;
            }
            return playerTokens.indexOf(winner) > -1;
        }).map(function (eachMatch) {
            var winner = eachMatch.players[eachMatch.winner];
            return {
                parent: eachMatch.matchID,
                playerIndex: playerTokens.indexOf(winner)
            };
        });
        parentMatches.forEach(function (matchParent) {
            var unlinkedIndex = _this.unlinkedMatches.findIndex(function (eachMatch) { return eachMatch.matchID === matchParent.parent; });
            _this.unlinkedMatches.splice(unlinkedIndex, 1);
        });
        match.parentMatches = parentMatches;
    };
    DoubleEliminationMatchmaker.prototype.getPlayers = function () {
        return __spreadArray([], this.players, true);
    };
    return DoubleEliminationMatchmaker;
}());
exports["default"] = DoubleEliminationMatchmaker;
//# sourceMappingURL=DoubleEliminationMatchmaker.js.map