import { Player } from ".";
export declare type GameInfoMessage = {
    name: string;
};
export declare type CreateGameMessage = {
    gameID: string;
    players: Player[];
};
export declare type GameCreatedMessage = {
    playerGameTokens: {
        [name: string]: string;
    };
};
export declare type GameServerHandoffMessage = {
    gameServerAddress: string;
    gameID: string;
    token: string;
};
export declare type PlayerToGameMessage = {
    payload: any;
};
export declare type GameToPlayerMessage = PlayerToGameMessage;
export declare type GameUpdatedMessage = {
    payload: any;
};
export declare type GameEndedMessage = {
    winner: Player | null;
    tie: boolean;
    duration: number;
    payload: any;
    message: string;
};
