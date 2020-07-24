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
var options_1 = require("./cli/options");
var TournamentServer_1 = require("./TournamentServer");
var server = new TournamentServer_1["default"](__assign({}, options_1.DEFAULT_OPTIONS, options_1["default"]()));
//# sourceMappingURL=index.js.map