import { Game } from "./Game";
import { MatchOptions } from "./Match";
import { Player } from "./Player";
import { TournamentOptions } from "./Tournament";
export declare type CreateMatchMessage = {
    players: Player[];
    options: MatchOptions;
};
export declare type MatchCreatedMessage = {
    playerTokens: {
        [name: string]: string;
    };
};
export declare type GameEndedMessage = Game;
export declare type GameInfoMessage = {
    name: string;
};
export declare type GameServerHandoffMessage = {
    gameServerAddress: string;
    token: string;
};
export declare type PlayerToGameMessage = {
    payload: any;
};
export declare type GameToPlayerMessage = PlayerToGameMessage;
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
