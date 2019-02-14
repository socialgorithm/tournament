import { Player } from "@socialgorithm/game-server/src/constants";
export declare type GameToPlayerMessage = {
    player: Player;
    event: string;
    payload: any;
};
export declare type NamespacedMessage = {
    namespace: string;
    event: string;
    payload: any;
};
