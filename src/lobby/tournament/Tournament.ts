import { Player } from "@socialgorithm/game-server/src/constants";
import { Match } from "./match/Match";

export type Tournament = {
    tournamentID: string,
    players: Player[],
    options: any,
    started: boolean,
    finished: boolean,
    matches: Match[],
    ranking: Player[],
};
