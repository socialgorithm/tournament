import { Player } from "./Player";
export declare type Lobby = {
    admin: Player;
    token: string;
    players: Player[];
    bannedPlayers: string[];
};
