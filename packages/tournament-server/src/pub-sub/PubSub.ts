import * as PubSubJS from "pubsub-js";
import { Events as PubSubEvents } from "./Events";

/**
 * Any class that wants to use the PubSub bus needs to extend this class.
 * No one should use PubSub directly!!
 */
export default class PubSub {
    private subscriptionTokens: string[] = [];

    public publish(event: string, data: unknown): void {
        PubSubJS.publish(event, data);
    }

    /**
     * Publish an event within a namespace
     * @param namespace Any string to namespace the event
     * @param event Regular event type
     * @param data
     */

    public publishNamespaced(namespace: string, event: PubSubEvents, data: unknown): void{
        const namespaced = this.makeNamespace(namespace, event);
        this.publish(namespaced, data);
    }

    public subscribeNamespaced(namespace: string, event: PubSubEvents, fn: (data: unknown) => void): void {
        const namespaced = this.makeNamespace(namespace, event);
        this.subscribe(namespaced, fn);
    }

    public subscribe(event: string, fn: (data: unknown) => void): void {
        const token = PubSubJS.subscribe(event, (events: PubSubEvents, data: unknown) => fn(data));
        this.subscriptionTokens.push(token);
    }

    public unsubscribeAll(): void {
        this.subscriptionTokens.forEach(token => {
            PubSubJS.unsubscribe(token);
        });
    }

    private makeNamespace(namespace: string, event: PubSubEvents): string {
        return `${event}--${namespace}`;
    }
}
