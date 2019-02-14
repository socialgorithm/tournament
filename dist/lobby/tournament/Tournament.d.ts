import { Match } from "./match/Match";
import { Player } from "@socialgorithm/game-server/src/constants";
export declare type Tournament = {
    tournamentID: string;
    players: Player[];
    started: boolean;
    finished: boolean;
    matches: Match[];
    type: string;
    ranking: Player[];
    options: any;
};
