import * as uuid from "uuid/v4";

import { Player } from "@socialgorithm/game-server/src/constants";
import IMatchMaker from "./matchmaker/MatchMaker";
import { Tournament } from "./Tournament";

export type TournamentOptions = {
    type: string,
};

export class TournamentRunner {
    public tournament: Tournament;
    private matchmaker: IMatchMaker;

    constructor(private options: TournamentOptions, public players: Player[], private lobbyToken: string) {
        this.tournament = {
            finished: false,
            matches: [],
            options,
            players,
            ranking: [],
            started: false,
            tournamentID: uuid(),
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

    public start() {
        console.log("Starting tournament", this.tournament, this.tournament.options);
        this.tournament.started = true;
    }

    public continue() {
        console.log("tournament continued!");
    }
}
