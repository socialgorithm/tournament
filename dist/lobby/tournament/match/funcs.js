"use strict";
exports.__esModule = true;
exports.getPercentage = function (num, total) {
    if (total < 1) {
        return "0%";
    }
    return Math.floor(num * 100 / total) + "%";
};
exports.round = function (time) {
    return Math.round(time * 100) / 100;
};
//# sourceMappingURL=funcs.js.map