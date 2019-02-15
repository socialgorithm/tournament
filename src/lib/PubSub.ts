import * as PubSubJS from 'pubsub-js';
import { EVENTS } from '../socket/events';
import * as msg from '../socket/messages';

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
    publish(event: EVENTS.BROADCAST_NAMESPACED, data: msg.BROADCAST_NAMESPACED_MESSAGE): void;
    publish(event: EVENTS.ADD_PLAYER_TO_NAMESPACE, data: msg.ADD_PLAYER_TO_NAMESPACE_MESSAGE): void;
    publish(event: EVENTS.PLAYER_TO_GAME, data: msg.PLAYER_TO_GAME_MESSAGE): void;
    publish(event: EVENTS.SERVER_TO_PLAYER, data: msg.SERVER_TO_PLAYER_MESSAGE): void;
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

    public subscribeNamespaced(namespace: string, event: EVENTS, fn: (data: any) => void) {
        const namespaced: any = this.makeNamespace(namespace, event);
        this.subscribe(namespaced, fn);
    }

    // Pure pubsub events
    subscribe(event: EVENTS.BROADCAST_NAMESPACED, fn: (data: msg.BROADCAST_NAMESPACED_MESSAGE) => void): void;
    subscribe(event: EVENTS.ADD_PLAYER_TO_NAMESPACE, fn: (data: msg.ADD_PLAYER_TO_NAMESPACE_MESSAGE) => void): void;
    subscribe(event: EVENTS.PLAYER_TO_GAME, fn: (data: msg.PLAYER_TO_GAME_MESSAGE) => void): void;
    subscribe(event: EVENTS.SERVER_TO_PLAYER, fn: (data: msg.SERVER_TO_PLAYER_MESSAGE) => void): void;
    // Socket relayed events
    subscribe(event: EVENTS.LOBBY_JOIN, fn: (data: msg.LOBBY_JOIN_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_CREATE, fn: (data: msg.LOBBY_CREATE_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_TOURNAMENT_START, fn: (data: msg.LOBBY_TOURNAMENT_START_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_TOURNAMENT_CONTINUE, fn: (data: msg.LOBBY_TOURNAMENT_CONTINUE_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_PLAYER_BAN, fn: (data: msg.LOBBY_PLAYER_BAN_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_PLAYER_KICK, fn: (data: msg.LOBBY_PLAYER_KICK_MESSAGE) => void): void;
    public subscribe(event: EVENTS, fn: (data: any) => void): void {
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