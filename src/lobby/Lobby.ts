import { Player } from "@socialgorithm/game-server";

export type Lobby = {
    admin: Player,
    token: string,
    players: Player[],
    bannedPlayers: string[],
};
