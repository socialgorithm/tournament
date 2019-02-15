import { Player } from "@socialgorithm/game-server/src/constants";
export declare type SERVER_TO_PLAYER_MESSAGE = {
    player: Player;
    event: string;
    payload: any;
};
export declare type PLAYER_TO_GAME_MESSAGE = {
    player: Player;
    data: any;
};
export declare type BROADCAST_NAMESPACED_MESSAGE = {
    namespace: string;
    event: string;
    payload: any;
};
export declare type ADD_PLAYER_TO_NAMESPACE_MESSAGE = {
    player: Player;
    namespace: string;
};
