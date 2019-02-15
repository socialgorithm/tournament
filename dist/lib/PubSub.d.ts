import { EVENTS } from '../socket/events';
import { BROADCAST_NAMESPACED_MESSAGE, ADD_PLAYER_TO_NAMESPACE_MESSAGE, PLAYER_TO_GAME_MESSAGE, SERVER_TO_PLAYER_MESSAGE } from '../socket/messages';
export default class PubSub {
    private subscriptionTokens;
    publish(event: EVENTS.BROADCAST_NAMESPACED, data: BROADCAST_NAMESPACED_MESSAGE): void;
    publish(event: EVENTS.ADD_PLAYER_TO_NAMESPACE, data: ADD_PLAYER_TO_NAMESPACE_MESSAGE): void;
    publish(event: EVENTS.PLAYER_TO_GAME, data: PLAYER_TO_GAME_MESSAGE): void;
    publish(event: EVENTS.SERVER_TO_PLAYER, data: SERVER_TO_PLAYER_MESSAGE): void;
    publishNamespaced(namespace: string, event: EVENTS, data: any): void;
    subscribeNamespaced(namespace: string, event: EVENTS, fn: Function): void;
    subscribe(event: EVENTS, fn: Function): void;
    unsubscribeAll(): void;
    private makeNamespace;
}
