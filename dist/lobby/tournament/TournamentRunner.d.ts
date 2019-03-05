import { Player } from "@socialgorithm/game-server/src/constants";
import { Tournament } from "./Tournament";
export declare type TournamentOptions = {
    autoPlay: boolean;
    numberOfGames: number;
    timeout: number;
    type: string;
};
export declare class TournamentRunner {
    tournament: Tournament;
    private pubSub;
    private matchmaker;
    constructor(options: TournamentOptions, players: Player[], lobby: string);
    start(): void;
    continue(): void;
}
