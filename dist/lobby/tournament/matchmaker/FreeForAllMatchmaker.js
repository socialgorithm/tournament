"use strict";
exports.__esModule = true;
var uuid = require("uuid/v4");
var FreeForAllMatchmaker = (function () {
    function FreeForAllMatchmaker(players, options) {
        var _this = this;
        this.players = players;
        this.options = options;
        this.matches = [];
        this.players.forEach(function (playerA) {
            _this.players.forEach(function (playerB) {
                if (playerA !== playerB && !_this.playersAlreadyMatched(playerA, playerB)) {
                    _this.matches.push({
                        games: [],
                        matchID: uuid(),
                        messages: [],
                        options: _this.options,
                        players: [playerA, playerB],
                        state: "upcoming",
                        winner: -1,
                        stats: {
                            gamesCompleted: 0,
                            gamesTied: 0,
                            wins: []
                        }
                    });
                }
            });
        });
    }
    FreeForAllMatchmaker.prototype.isFinished = function () {
        return this.getRemainingMatches().length === 0;
    };
    FreeForAllMatchmaker.prototype.updateStats = function (allMatches, tournamentFinished) {
        if (tournamentFinished === void 0) { tournamentFinished = false; }
        this.matches = allMatches;
    };
    FreeForAllMatchmaker.prototype.getRemainingMatches = function () {
        return this.matches.filter(function (match) { return match.state !== "finished"; });
    };
    FreeForAllMatchmaker.prototype.getRanking = function () {
        var playerStats = {};
        this.matches.forEach(function (match) {
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
    FreeForAllMatchmaker.prototype.playersAlreadyMatched = function (playerA, playerB) {
        return this.matches.find(function (match) {
            return match.players[0] === playerA && match.players[1] === playerB ||
                match.players[1] === playerA && match.players[0] === playerB;
        });
    };
    return FreeForAllMatchmaker;
}());
exports["default"] = FreeForAllMatchmaker;
//# sourceMappingURL=FreeForAllMatchmaker.js.map