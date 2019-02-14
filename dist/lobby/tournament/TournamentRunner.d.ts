import { Tournament } from './Tournament';
import { Player } from '@socialgorithm/game-server/src/constants';
export declare type TournamentOptions = {
    type: string;
};
export declare class TournamentRunner {
    private options;
    players: Player[];
    private lobbyToken;
    tournament: Tournament;
    private matchmaker;
    constructor(options: TournamentOptions, players: Player[], lobbyToken: string);
    start(): void;
    continue(): void;
}
