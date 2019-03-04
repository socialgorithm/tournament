import { Player } from "@socialgorithm/game-server/src/constants";
import { Match } from "./match/Match";
import { TournamentOptions } from "./TournamentRunner";
export declare type Tournament = {
    tournamentID: string;
    players: Player[];
    options: TournamentOptions;
    started: boolean;
    finished: boolean;
    matches: Match[];
    ranking: Player[];
};
