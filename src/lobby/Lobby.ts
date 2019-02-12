import { Player } from "./Player";

export type Lobby = {
    admin: Player,
    name: string,
    players: Player[],
    bannedPlayers: string[],
};