import * as uuid from "uuid/v4";

import { Player } from "@socialgorithm/game-server/src/constants";
import PubSub from "../../lib/PubSub";
import { EVENTS } from "../../socket/events";
import IMatchMaker from "./matchmaker/MatchMaker";
import { Tournament } from "./Tournament";

export type TournamentOptions = {
  type: string,
};

export class TournamentRunner {
  public tournament: Tournament;
  private pubSub: PubSub;
  private matchmaker: IMatchMaker;

  constructor(private options: TournamentOptions, public players: Player[], lobby: string) {
    this.tournament = {
      finished: false,
      lobby,
      matches: [],
      options,
      players,
      ranking: [],
      started: false,
      tournamentID: uuid(),
    };

    this.pubSub = new PubSub();
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

    // Notify
    this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
      event: "lobby tournament started",
      namespace: this.tournament.lobby,
      payload: {
        tournament: this.tournament,
      },
    });
  }

  public continue() {
    console.log("tournament continued!");
  }
}
