import * as uuid from "uuid/v4";

import { Player } from "@socialgorithm/game-server/src/constants";
import PubSub from "../../lib/PubSub";
import { EVENTS } from "../../socket/events";
import { MatchOptions } from "./match/Match";
import DoubleEliminationMatchmaker from "./matchmaker/DoubleEliminationMatchmaker";
import FreeForAllMatchmaker from "./matchmaker/FreeForAllMatchmaker";
import IMatchMaker from "./matchmaker/MatchMaker";
import { Tournament } from "./Tournament";

export type TournamentOptions = {
  autoPlay: boolean,
  numberOfGames: number,
  timeout: number,
  type: string,
};

export class TournamentRunner {
  public tournament: Tournament;
  private pubSub: PubSub;
  private matchmaker: IMatchMaker;

  constructor(options: TournamentOptions, players: Player[], lobby: string) {
    this.tournament = {
      finished: false,
      lobby,
      options,
      players,
      ranking: [],
      started: false,
      tournamentID: uuid(),
    };

    this.pubSub = new PubSub();

    // this.subscribeNamespaced(this.tournamentID, MATCH_END, this.playNextMatch);
  }

  public start() {
    console.log("Starting tournament", this.tournament, this.tournament.options);
    this.tournament.started = true;

    const matchOptions: MatchOptions = {
      autoPlay: this.tournament.options.autoPlay,
      maxGames: this.tournament.options.numberOfGames,
      timeout: this.tournament.options.timeout,
    };

    switch (this.tournament.options.type) {
      case "DoubleElimination":
        console.log("Doing Double Elim");
        this.matchmaker = new DoubleEliminationMatchmaker(this.tournament.players, matchOptions);
        break;
      case "FreeForAll":
      default:
        console.log("Doing Default");
        this.matchmaker = new FreeForAllMatchmaker(this.tournament.players, matchOptions);
        break;
    }

    const matches = this.matchmaker.getRemainingMatches();

    // Notify
    this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
      event: "lobby tournament started",
      namespace: this.tournament.lobby,
      payload: {
        tournament: {
          matches,
          ...this.tournament,
        },
      },
    });
  }

  public continue() {
    console.log("tournament continued!");
  }
}
