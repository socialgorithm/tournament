import { Player } from "@socialgorithm/game-server/src/constants";

/**
 * PubSub/Socket API: Message Definitions
 */

 export type SERVER_TO_PLAYER_MESSAGE = {
    player: Player,
    event: string,
    payload: any,
 };

 export type PLAYER_TO_GAME_MESSAGE = {
    player: Player,
    data: any,
 };

 export type BROADCAST_NAMESPACED_MESSAGE = {
    namespace: string,
    event: string,
    payload: any,
 };

 export type ADD_PLAYER_TO_NAMESPACE_MESSAGE = {
    player: Player,
    namespace: string,
 };