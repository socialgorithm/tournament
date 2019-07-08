import { Player } from "@socialgorithm/game-server";
import { Match } from "./match/Match";
export declare type TournamentOptions = {
    gameAddress: string;
    autoPlay: boolean;
    numberOfGames: number;
    timeout: number;
    type: string;
};
export declare class TournamentRunner {
    private tournament;
    private pubSub;
    private matchmaker;
    private matches;
    private currentMatchRunner?;
    constructor(options: TournamentOptions, players: Player[], lobby: string);
    getTournament: () => {
        tournamentID: string;
        players: string[];
        lobby: string;
        options: TournamentOptions;
        started: boolean;
        finished: boolean;
        ranking: string[];
        waiting: boolean;
        matches: Match[];
    };
    start: () => void;
    continue: () => void;
    destroy: () => void;
    private onTournamentEnd;
    private onMatchEnd;
    private playNextMatch;
    private sendStats;
}
