"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:game-server-list-publisher");
var Events_1 = require("../events/Events");
var PubSub_1 = require("../pub-sub/PubSub");
var GameServerListPublisher = (function () {
    function GameServerListPublisher() {
        var _this = this;
        this.pubSub = new PubSub_1["default"]();
        this.gameList = {};
        this.pubSub.subscribe(Events_1.EVENTS.GAME_SERVER_UPDATE, function (status) {
            debug("Received game server update %O", status);
            _this.gameList[status.address] = status;
            _this.publishGameList();
        });
    }
    GameServerListPublisher.prototype.publishGameList = function () {
        this.pubSub.publish(Events_1.EVENTS.GAME_LIST, Object.values(this.gameList));
    };
    return GameServerListPublisher;
}());
exports.GameServerListPublisher = GameServerListPublisher;
//# sourceMappingURL=GameServerListPublisher.js.map