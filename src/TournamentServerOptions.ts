import { GameServerAddress } from "@socialgorithm/model";

export interface ITournamentServerOptions {
    games: GameServerAddress[];
    port: number;
}
