import * as PubSubJS from "pubsub-js";
import { Events as PubSubEvents } from "./Events";

/**
 * Any class that wants to use the PubSub bus needs to extend this class.
 * No one should use PubSub directly!!
 */
export default class PubSub {
    private subscriptionTokens: string[] = [];

    public publish(event: PubSubEvents, data: any) {
        PubSubJS.publish(event, data);
    }

    /**
     * Publish an event within a namespace
     * @param namespace Any string to namespace the event
     * @param event Regular event type
     * @param data
     */

    public publishNamespaced(namespace: string, event: PubSubEvents, data: any) {
        const namespaced: any = this.makeNamespace(namespace, event);
        this.publish(namespaced, data);
    }

    public subscribeNamespaced(namespace: string, event: PubSubEvents, fn: (data: any) => void) {
        const namespaced: any = this.makeNamespace(namespace, event);
        this.subscribe(namespaced, fn);
    }

    public subscribe(event: PubSubEvents, fn: (data: any) => void): void {
        const token = PubSubJS.subscribe(event, (events: PubSubEvents, data: any) => fn(data));
        this.subscriptionTokens.push(token);
    }

    public unsubscribeAll() {
        this.subscriptionTokens.forEach(token => {
            PubSubJS.unsubscribe(token);
        });
    }

    private makeNamespace(namespace: string, event: PubSubEvents): string {
        return `${event}--${namespace}`;
    }
}
