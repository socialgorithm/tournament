"use strict";
exports.__esModule = true;
exports.toTournamentServerOptions = void 0;
var TournamentServer_1 = require("../TournamentServer");
exports["default"] = (function (options) {
    new TournamentServer_1["default"](toTournamentServerOptions(options));
});
function toTournamentServerOptions(options) {
    return {
        games: options.game.map(function (game) {
            var _a = game.split(","), tournamentServerAccessibleAddress = _a[0], playerAccessibleAddress = _a[1];
            return { tournamentServerAccessibleAddress: tournamentServerAccessibleAddress, playerAccessibleAddress: playerAccessibleAddress };
        }),
        port: options.port
    };
}
exports.toTournamentServerOptions = toTournamentServerOptions;
//# sourceMappingURL=index.js.map