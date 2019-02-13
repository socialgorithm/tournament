"use strict";
exports.__esModule = true;
var GameRunner = (function () {
    function GameRunner() {
    }
    GameRunner.prototype.start = function () {
        this.sendToGame({
            type: 'START',
            payload: {
                players: this.game.players
            }
        });
    };
    GameRunner.prototype.onFinish = function (data) {
        this.game.stats = data.stats;
        this.game.winner = data.winner;
        this.game.tie = data.tie;
        this.game.duration = data.duration;
        this.game.message = data.message;
    };
    GameRunner.prototype.onUpdate = function (data) {
        this.game.stats = data.stats;
    };
    GameRunner.prototype.onGameToServer = function (data) {
        switch (data.type) {
            case 'UPDATE':
                this.onUpdate(data.payload);
                break;
            case 'END':
                this.onFinish(data.payload);
                break;
            default:
                console.warn('Unsupported message from game server');
        }
    };
    GameRunner.prototype.onPlayerToGame = function (player, data) {
    };
    GameRunner.prototype.onGameToPlayer = function (player, data) {
    };
    GameRunner.prototype.sendToGame = function (data) {
    };
    return GameRunner;
}());
exports.GameRunner = GameRunner;
//# sourceMappingURL=GameRunner.js.map