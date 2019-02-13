"use strict";
exports.__esModule = true;
var uuid = require("uuid/v4");
var FreeForAllMatchmaker = (function () {
    function FreeForAllMatchmaker(players, options) {
        this.players = players;
        this.options = options;
        this.index = 0;
    }
    FreeForAllMatchmaker.prototype.isFinished = function () {
        return this.finished;
    };
    FreeForAllMatchmaker.prototype.updateStats = function (tournamentStats) {
        this.tournamentStats = tournamentStats;
    };
    FreeForAllMatchmaker.prototype.getRemainingMatches = function () {
        var _this = this;
        if (this.index >= this.players.length) {
            return [];
        }
        var match = [];
        var matches = this.players.map(function (playerA, $index) {
            if (_this.index === $index) {
                return [];
            }
            return [_this.players[_this.index]].filter(function (playerB) {
                return !(_this.tournamentStats.matches.find(function (eachMatch) {
                    return eachMatch.players[0] === playerA && eachMatch.players[1] === playerB ||
                        eachMatch.players[1] === playerA && eachMatch.players[0] === playerB;
                }));
            }).map(function (playerB) {
                var newMatch = {
                    matchID: uuid(),
                    players: [playerA, playerB],
                    games: [],
                    state: 'upcoming'
                };
                return newMatch;
            });
        }).reduce(function (result, current, idx) { return result.concat(current); }, []);
        ++this.index;
        this.finished = this.index >= this.players.length;
        return matches;
    };
    FreeForAllMatchmaker.prototype.getRanking = function () {
        var playerStats = {};
        this.tournamentStats.matches.forEach(function (match) {
            if (!playerStats[match.players[0]]) {
                playerStats[match.players[0]] = 0;
            }
            if (!playerStats[match.players[1]]) {
                playerStats[match.players[1]] = 0;
            }
        });
        return Object.keys(playerStats).map(function (token) { return ({
            gamesWon: playerStats[token],
            player: token
        }); }).sort(function (a, b) { return b.gamesWon - a.gamesWon; }).map(function (playerRank) { return playerRank.player; });
    };
    return FreeForAllMatchmaker;
}());
exports["default"] = FreeForAllMatchmaker;
//# sourceMappingURL=FreeForAllMatchmaker.js.map