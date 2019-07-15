"use strict";
exports.__esModule = true;
var debug = require("debug")("sg:game-server-list-publisher");
var pub_sub_1 = require("../pub-sub");
var PubSub_1 = require("../pub-sub/PubSub");
var GameServerListPublisher = (function () {
    function GameServerListPublisher() {
        var _this = this;
        this.pubSub = new PubSub_1["default"]();
        this.gameList = {};
        this.pubSub.subscribe(pub_sub_1.Events.GameServerStatus, function (status) {
            debug("Received game server update %O", status);
            _this.gameList[status.address] = status;
            _this.publishGameList();
        });
    }
    GameServerListPublisher.prototype.publishGameList = function () {
        this.pubSub.publish(pub_sub_1.Events.GameList, Object.values(this.gameList));
    };
    return GameServerListPublisher;
}());
exports.GameServerListPublisher = GameServerListPublisher;
//# sourceMappingURL=GameServerListPublisher.js.map