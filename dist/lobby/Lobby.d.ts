import { Player } from "@socialgorithm/game-server";
export declare type Lobby = {
    admin: Player;
    token: string;
    players: Player[];
    bannedPlayers: string[];
};
