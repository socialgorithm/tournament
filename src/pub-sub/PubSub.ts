
import { EVENTS, MSG } from "@socialgorithm/model";
import * as PubSubJS from "pubsub-js";
import { GameServerStatus } from "../game-server/GameServerInfoConnection";

/**
 * Any class that wants to use the PubSub bus needs to extend this class.
 * No one should use PubSub directly!!
 */
export default class PubSub {
    private subscriptionTokens: string[] = [];

    /**
     * Main publish method, with overloaded definitions for each event type
     * @param event Event name
     * @param data Paylad to be sent
     */
    public publish(event: EVENTS.BROADCAST_NAMESPACED, data: MSG.BROADCAST_NAMESPACED_MESSAGE): void;
    public publish(event: EVENTS.ADD_PLAYER_TO_NAMESPACE, data: MSG.ADD_PLAYER_TO_NAMESPACE_MESSAGE): void;
    public publish(event: EVENTS.SERVER_TO_PLAYER, data: MSG.SERVER_TO_PLAYER_MESSAGE): void;
    public publish(event: EVENTS.GAME_SERVER_UPDATE, data: GameServerStatus): void;
    public publish(event: EVENTS.GAME_LIST, data: GameServerStatus[]): void;
    public publish(event: EVENTS.PLAYER_DISCONNECTED, data: MSG.PLAYER_DISCONNECTED_MESSAGE): void;
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
    public subscribe(event: EVENTS.BROADCAST_NAMESPACED, fn: (data: MSG.BROADCAST_NAMESPACED_MESSAGE) => void): void;
    public subscribe(event: EVENTS.ADD_PLAYER_TO_NAMESPACE, fn: (data: MSG.ADD_PLAYER_TO_NAMESPACE_MESSAGE) => void): void;
    public subscribe(event: EVENTS.PLAYER_DISCONNECTED, fn: (data: MSG.PLAYER_DISCONNECTED_MESSAGE) => void): void;
    public subscribe(event: EVENTS.SERVER_TO_PLAYER, fn: (data: MSG.SERVER_TO_PLAYER_MESSAGE) => void): void;
    public subscribe(event: EVENTS.GAME_SERVER_UPDATE, fn: (data: GameServerStatus) => void): void;
    // Socket relayed events
    public subscribe(event: EVENTS.LOBBY_JOIN, fn: (data: MSG.LOBBY_JOIN_MESSAGE) => void): void;
    public subscribe(event: EVENTS.LOBBY_CREATE, fn: (data: MSG.LOBBY_CREATE_MESSAGE) => void): void;
    public subscribe(event: EVENTS.LOBBY_TOURNAMENT_START, fn: (data: MSG.LOBBY_TOURNAMENT_START_MESSAGE) => void): void;
    public subscribe(event: EVENTS.LOBBY_TOURNAMENT_CONTINUE, fn: (data: MSG.LOBBY_TOURNAMENT_CONTINUE_MESSAGE) => void): void;
    public subscribe(event: EVENTS.LOBBY_PLAYER_BAN, fn: (data: MSG.LOBBY_PLAYER_BAN_MESSAGE) => void): void;
    public subscribe(event: EVENTS.LOBBY_PLAYER_KICK, fn: (data: MSG.LOBBY_PLAYER_KICK_MESSAGE) => void): void;
    public subscribe(event: EVENTS.GAME_LIST, fn: (data: GameServerStatus[]) => void): void;
    public subscribe(event: EVENTS, fn: (data: any) => void): void {
        const token = PubSubJS.subscribe(event, (events: EVENTS, data: any) => fn(data));
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
