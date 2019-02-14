import { Player } from "@socialgorithm/game-server/src/constants";

export type Lobby = {
    admin: Player,
    name: string,
    players: Player[],
    bannedPlayers: string[],
};