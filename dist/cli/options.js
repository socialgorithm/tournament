"use strict";
exports.__esModule = true;
exports.DEFAULT_OPTIONS = void 0;
var commandLineArgs = require("command-line-args");
var getUsage = require("command-line-usage");
var info = require("../../package.json");
exports.DEFAULT_OPTIONS = {
    game: ["http://localhost:5433,http://localhost:5433"],
    port: parseInt(process.env.PORT, 10) || 3141
};
var optionDefinitions = [
    {
        alias: "g",
        name: "game",
        description: "A game server to connect to, defaults to {underline " + exports.DEFAULT_OPTIONS.game + "}. In this comma-separated list, the first value is the address to be used by the tournament server, while the second one is sent to players (as they are rarely running on the same machine)",
        type: String,
        typeLabel: "{underline " + exports.DEFAULT_OPTIONS.game + "}",
        multiple: true,
        defaultValue: exports.DEFAULT_OPTIONS.game
    },
    {
        alias: "p",
        defaultValue: exports.DEFAULT_OPTIONS.port,
        description: "Port on which the server should be started, defaults to {underline " + exports.DEFAULT_OPTIONS.port + "}",
        name: "port",
        type: Number,
        typeLabel: "{underline " + exports.DEFAULT_OPTIONS.port + "}"
    },
    {
        alias: "v",
        description: "Display the server version",
        name: "version",
        type: Boolean
    },
    {
        alias: "h",
        description: "Print this guide",
        name: "help",
        type: Boolean
    },
];
var sections = [
    {
        header: info.name + " v" + info.version,
        content: info.description
    },
    {
        header: "Options",
        optionList: optionDefinitions
    },
    {
        header: "Synopsis",
        content: [
            "$ " + info.name + " {bold --game} {underline http://localhost:5001,http://uttt.socialgorithm.org} {bold --game} {underline http://localhost:5002,http://battleships.socialgorithm.org}",
            "$ " + info.name + " {bold --port} {underline 5000}",
            "$ " + info.name + " {bold --help}",
        ]
    },
];
exports["default"] = (function () {
    var options = commandLineArgs(optionDefinitions);
    Object.keys(options).map(function (key) {
        if (options[key] === null) {
            options[key] = true;
        }
    });
    if (options.version) {
        console.log(info.version);
        process.exit(0);
    }
    if (options.help) {
        console.log(getUsage(sections));
        process.exit(0);
    }
    if (options.port) {
        options.port = parseInt(options.port, 10);
    }
    return options;
});
//# sourceMappingURL=options.js.map