import { Match } from "./match/Match";
import { Player } from "@socialgorithm/game-server/src/constants";
export declare type Tournament = {
    tournamentID: string;
    players: Player[];
    options: any;
    started: boolean;
    finished: boolean;
    matches: Match[];
    ranking: Player[];
};
