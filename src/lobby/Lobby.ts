import { Player } from "@socialgorithm/game-server/dist/constants";

export type Lobby = {
    admin: Player,
    token: string,
    players: Player[],
    bannedPlayers: string[],
};
