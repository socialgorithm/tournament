import * as uuid from "uuid/v4";

import { Player } from "@socialgorithm/game-server/src/constants";
import PubSub from "../../lib/PubSub";
import { EVENTS } from "../../socket/events";
import { Match, MatchOptions } from "./match/Match";
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
  private tournament: Tournament;
  private pubSub: PubSub;
  private matchmaker: IMatchMaker;
  private matches: Match[] = [];

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

  public getTournament() {
    return {
      matches: this.matches,
      ...this.tournament,
    };
  }

  public start() {
    if (this.tournament.started) {
      console.log("Tournament already started, not starting", this.getTournament());
      return;
    }

    this.tournament.started = true;

    const matchOptions: MatchOptions = {
      autoPlay: this.tournament.options.autoPlay,
      maxGames: this.tournament.options.numberOfGames,
      timeout: this.tournament.options.timeout,
    };

    switch (this.tournament.options.type) {
      case "DoubleElimination":
        this.matchmaker = new DoubleEliminationMatchmaker(this.tournament.players, matchOptions);
        break;
      case "FreeForAll":
      default:
        this.matchmaker = new FreeForAllMatchmaker(this.tournament.players, matchOptions);
        break;
    }

    this.matches = this.matchmaker.getRemainingMatches();

    // Notify
    this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
      event: EVENTS.LOBBY_TOURNAMENT_STARTED,
      namespace: this.tournament.lobby,
      payload: {
        tournament: this.getTournament,
      },
    });
  }

  public continue() {
    console.log("tournament continued!");
  }
}
