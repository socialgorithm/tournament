import { Player } from "@socialgorithm/game-server";
import { TournamentOptions } from "@socialgorithm/model";
export declare type Tournament = {
    tournamentID: string;
    players: Player[];
    lobby: string;
    options: TournamentOptions;
    started: boolean;
    finished: boolean;
    ranking: Player[];
    waiting: boolean;
};
