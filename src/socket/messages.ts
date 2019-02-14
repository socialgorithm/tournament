import { Player } from "@socialgorithm/game-server/src/constants";

/**
 * PubSub/Socket API: Message Definitions
 */

 export type GameToPlayerMessage = {
    player: Player,
    event: string,
    payload: any,
 };

 export type NamespacedMessage = {
    namespace: string,
    event: string,
    payload: any,
 };