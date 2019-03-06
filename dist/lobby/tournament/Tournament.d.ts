import { Player } from "@socialgorithm/game-server/dist/constants";
import { TournamentOptions } from "./TournamentRunner";
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
