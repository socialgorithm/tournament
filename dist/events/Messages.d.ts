import { Player } from "@socialgorithm/game-server";
import { TournamentOptions } from "../lobby/tournament/TournamentRunner";
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
export declare type LOBBY_JOIN_MESSAGE = {
    player: Player;
    payload: {
        token: string;
        spectating: boolean;
    };
};
export declare type LOBBY_CREATE_MESSAGE = {
    player: Player;
};
export declare type LOBBY_TOURNAMENT_START_MESSAGE = {
    payload: {
        token: string;
        options: TournamentOptions;
        players: Player[];
    };
};
export declare type LOBBY_TOURNAMENT_CONTINUE_MESSAGE = {};
export declare type LOBBY_PLAYER_BAN_MESSAGE = {
    player: Player;
};
export declare type LOBBY_PLAYER_KICK_MESSAGE = {
    player: Player;
};
export declare type PLAYER_DISCONNECTED_MESSAGE = {
    player: Player;
};
