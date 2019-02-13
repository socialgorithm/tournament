import { Player } from "../Player";
import { Match } from "./match/Match";
export declare type Tournament = {
    tournamentID: string;
    players: Player[];
    started: boolean;
    finished: boolean;
    matches: Match[];
    type: string;
};
