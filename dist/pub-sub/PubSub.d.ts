import { EVENTS, MSG } from "@socialgorithm/model";
import { GameServerStatus } from "../game-server/GameServerInfoConnection";
export default class PubSub {
    private subscriptionTokens;
    publish(event: EVENTS.BROADCAST_NAMESPACED, data: MSG.BROADCAST_NAMESPACED_MESSAGE): void;
    publish(event: EVENTS.ADD_PLAYER_TO_NAMESPACE, data: MSG.ADD_PLAYER_TO_NAMESPACE_MESSAGE): void;
    publish(event: EVENTS.SERVER_TO_PLAYER, data: MSG.SERVER_TO_PLAYER_MESSAGE): void;
    publish(event: EVENTS.GAME_SERVER_UPDATE, data: GameServerStatus): void;
    publish(event: EVENTS.GAME_LIST, data: GameServerStatus[]): void;
    publish(event: EVENTS.PLAYER_DISCONNECTED, data: MSG.PLAYER_DISCONNECTED_MESSAGE): void;
    publishNamespaced(namespace: string, event: EVENTS, data: any): void;
    subscribeNamespaced(namespace: string, event: EVENTS, fn: (data: any) => void): void;
    subscribe(event: EVENTS.BROADCAST_NAMESPACED, fn: (data: MSG.BROADCAST_NAMESPACED_MESSAGE) => void): void;
    subscribe(event: EVENTS.ADD_PLAYER_TO_NAMESPACE, fn: (data: MSG.ADD_PLAYER_TO_NAMESPACE_MESSAGE) => void): void;
    subscribe(event: EVENTS.PLAYER_DISCONNECTED, fn: (data: MSG.PLAYER_DISCONNECTED_MESSAGE) => void): void;
    subscribe(event: EVENTS.SERVER_TO_PLAYER, fn: (data: MSG.SERVER_TO_PLAYER_MESSAGE) => void): void;
    subscribe(event: EVENTS.GAME_SERVER_UPDATE, fn: (data: GameServerStatus) => void): void;
    subscribe(event: EVENTS.LOBBY_JOIN, fn: (data: MSG.LOBBY_JOIN_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_CREATE, fn: (data: MSG.LOBBY_CREATE_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_TOURNAMENT_START, fn: (data: MSG.LOBBY_TOURNAMENT_START_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_TOURNAMENT_CONTINUE, fn: (data: MSG.LOBBY_TOURNAMENT_CONTINUE_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_PLAYER_BAN, fn: (data: MSG.LOBBY_PLAYER_BAN_MESSAGE) => void): void;
    subscribe(event: EVENTS.LOBBY_PLAYER_KICK, fn: (data: MSG.LOBBY_PLAYER_KICK_MESSAGE) => void): void;
    subscribe(event: EVENTS.GAME_LIST, fn: (data: GameServerStatus[]) => void): void;
    unsubscribeAll(): void;
    private makeNamespace;
}
