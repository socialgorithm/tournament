"use strict";
exports.__esModule = true;
var PubSubJS = require("pubsub-js");
var events_1 = require("../socket/events");
var PubSub = (function () {
    function PubSub() {
        this.subscriptionTokens = [];
    }
    PubSub.prototype.publish = function (event, data) {
        console.log("Publish event: " + event);
        if (event === events_1.EVENTS.SERVER_TO_PLAYER) {
            console.log(data);
        }
        PubSubJS.publish(event, data);
    };
    PubSub.prototype.publishNamespaced = function (namespace, event, data) {
        var namespaced = this.makeNamespace(namespace, event);
        this.publish(namespaced, data);
    };
    PubSub.prototype.subscribeNamespaced = function (namespace, event, fn) {
        var namespaced = this.makeNamespace(namespace, event);
        this.subscribe(namespaced, fn);
    };
    PubSub.prototype.subscribe = function (event, fn) {
        var token = PubSubJS.subscribe(event, function (events, data) { return fn(data); });
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