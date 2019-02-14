import * as uuid from 'uuid/v4';

import { Tournament } from './Tournament';
import IMatchMaker from './matchmaker/MatchMaker';
import { Player } from '@socialgorithm/game-server/src/constants';

export type TournamentOptions = {
    type: string,
};

export class TournamentRunner {
    private tournament: Tournament;
    private matchmaker: IMatchMaker;

    constructor(private options: TournamentOptions, public players: Player[], private lobbyToken: string) {
        this.tournament = {
            tournamentID: uuid(),
            players,
            started: false,
            finished: false,
            matches: [],
            type: options.type,
        };
        // const matchOptions: MatchOptions = {
        //     maxGames: this.options.numberOfGames,
        //     timeout: this.options.timeout,
        // };
        // switch (options.type) {
        //     case 'FreeForAll':
        //     default:
        //         this.matchmaker = new FreeForAllMatchmaker(this.players, matchOptions);
        //         break;
        // }

        // this.subscribeNamespaced(this.tournamentID, MATCH_END, this.playNextMatch);
    }
}