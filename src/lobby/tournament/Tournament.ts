import { Player } from "@socialgorithm/game-server/src/constants";
import { Match } from "./match/Match";
import { TournamentOptions } from "./TournamentRunner";

export type Tournament = {
    tournamentID: string,
    players: Player[],
    lobby: string,
    options: TournamentOptions,
    started: boolean,
    finished: boolean,
    ranking: Player[],
};
