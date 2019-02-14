"use strict";
exports.__esModule = true;
var PubSubJS = require("pubsub-js");
var PubSub = (function () {
    function PubSub() {
        this.subscriptionTokens = [];
    }
    PubSub.prototype.publish = function (event, data) {
        PubSubJS.publish(event, data);
    };
    PubSub.prototype.publishNamespaced = function (namespace, event, data) {
        this.publish(this.makeNamespace(namespace, event), data);
    };
    PubSub.prototype.subscribeNamespaced = function (namespace, event, fn) {
        this.subscribe(this.makeNamespace(namespace, event), fn);
    };
    PubSub.prototype.subscribe = function (event, fn) {
        var token = PubSubJS.subscribe(event, function (event, data) { return fn(data); });
        this.subscriptionTokens.push(token);
    };
    PubSub.prototype.unsubscribeAll = function () {
        this.subscriptionTokens.forEach(function (token) {
            PubSubJS.unsubscribe(token);
        });
    };
    PubSub.prototype.makeNamespace = function (namespace, event) {
        return event + "--" + namespace;
    };
    return PubSub;
}());
exports["default"] = PubSub;
//# sourceMappingURL=PubSub.js.map