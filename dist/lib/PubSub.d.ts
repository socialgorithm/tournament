import { EVENTS } from '../socket/events';
import * as msg from '../socket/messages';
export default class PubSub {
    private subscriptionTokens;
    publish(event: EVENTS.BROADCAST_NAMESPACED, data: msg.BROADCAST_NAMESPACED_MESSAGE): void;
    publish(event: EVENTS.ADD_PLAYER_TO_NAMESPACE, data: msg.ADD_PLAYER_TO_NAMESPACE_MESSAGE): void;
    publish(event: EVENTS.PLAYER_TO_GAME, data: msg.PLAYER_TO_GAME_MESSAGE): void;
    publish(event: EVENTS.SERVER_TO_PLAYER, data: msg.SERVER_TO_PLAYER_MESSAGE): void;
    publishNamespaced(namespace: string, event: EVENTS, data: any): void;
    subscribeNamespaced(namespace: string, event: EVENTS, fn: (data: any) => void): void;
    subscribe(event: EVENTS.BROADCAST_NAMESPACED, fn: (data: msg.BROADCAST_NAMESPACED_MESSAGE) => void): void;
    subscribe(event: EVENTS.ADD_PLAYER_TO_NAMESPACE, fn: (data: msg.ADD_PLAYER_TO_NAMESPACE_MESSAGE) => void): void;
    subscribe(event: EVENTS.PLAYER_TO_GAME, fn: (data: msg.PLAYER_TO_GAME_MESSAGE) => void): void;
    subscribe(event: EVENTS.SERVER_TO_PLAYER, fn: (data: msg.SERVER_TO_PLAYER_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_JOIN, fn: (data: msg.LOBBY_JOIN_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_CREATE, fn: (data: msg.LOBBY_CREATE_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_TOURNAMENT_START, fn: (data: msg.LOBBY_TOURNAMENT_START_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_TOURNAMENT_CONTINUE, fn: (data: msg.LOBBY_TOURNAMENT_CONTINUE_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_PLAYER_BAN, fn: (data: msg.LOBBY_PLAYER_BAN_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_PLAYER_KICK, fn: (data: msg.LOBBY_PLAYER_KICK_MESSAGE) => void): void;
    unsubscribeAll(): void;
    private makeNamespace;
}
