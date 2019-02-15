import * as PubSubJS from 'pubsub-js';
import { EVENTS } from '../socket/events';
import { BROADCAST_NAMESPACED_MESSAGE, ADD_PLAYER_TO_NAMESPACE_MESSAGE, PLAYER_TO_GAME_MESSAGE, SERVER_TO_PLAYER_MESSAGE } from '../socket/messages';

/**
 * Any class that wants to use the PubSub bus needs to extend this class.
 * No one should use PubSub directly!!
 */
export default class PubSub {
    private subscriptionTokens: Array<string> = [];

    /**
     * Main publish method, with overloaded definitions for each event type
     * @param event Event name
     * @param data Paylad to be sent
     */
    public publish(event: EVENTS.BROADCAST_NAMESPACED, data: BROADCAST_NAMESPACED_MESSAGE): void;
    public publish(event: EVENTS.ADD_PLAYER_TO_NAMESPACE, data: ADD_PLAYER_TO_NAMESPACE_MESSAGE): void;
    public publish(event: EVENTS.PLAYER_TO_GAME, data: PLAYER_TO_GAME_MESSAGE): void;
    public publish(event: EVENTS.SERVER_TO_PLAYER, data: SERVER_TO_PLAYER_MESSAGE): void;
    public publish(event: string, data: any) {
        PubSubJS.publish(event, data);
    }

    /**
     * Publish an event within a namespace
     * @param namespace Any string to namespace the event
     * @param event Regular event type
     * @param data 
     */
    public publishNamespaced(namespace: string, event: EVENTS, data: any) {
        const namespaced: any = this.makeNamespace(namespace, event);
        this.publish(namespaced, data);
    }

    public subscribeNamespaced(namespace: string, event: EVENTS, fn: Function) {
        const namespaced: any = this.makeNamespace(namespace, event);
        this.subscribe(namespaced, fn);
    }

    public subscribe(event: EVENTS, fn: Function): void {
        const token = PubSubJS.subscribe(event, (event: EVENTS, data: any) => fn(data));
        this.subscriptionTokens.push(token);
    }

    public unsubscribeAll() {
        this.subscriptionTokens.forEach(token => {
            PubSubJS.unsubscribe(token);
        });
    }

    private makeNamespace(namespace: string, event: EVENTS): string {
        return `${event}--${namespace}`;
    }
}