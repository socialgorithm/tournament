import { Match } from "./match/Match";
import { Player } from "@socialgorithm/game-server/src/constants";

export type Tournament = {
    tournamentID: string,
    players: Player[],
    started: boolean,
    finished: boolean,
    matches: Match[],
    type: string,
    ranking: Player[],
    options: any,
};