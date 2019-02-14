import { Player } from "@socialgorithm/game-server/src/constants";
export declare type Lobby = {
    admin: Player;
    token: string;
    players: Player[];
    bannedPlayers: string[];
};
