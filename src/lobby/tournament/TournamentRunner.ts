import * as uuid from "uuid/v4";

import { Player } from "@socialgorithm/game-server/dist/constants";
import PubSub from "../../lib/PubSub";
import { EVENTS } from "../../socket/events";
import { Match, MatchOptions } from "./match/Match";
import { MatchRunner } from "./match/MatchRunner";
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
      waiting: !options.autoPlay,
    };

    this.pubSub = new PubSub();
    this.pubSub.subscribeNamespaced(this.tournament.tournamentID, EVENTS.MATCH_ENDED, this.playNextMatch);
    this.pubSub.subscribeNamespaced(this.tournament.tournamentID, EVENTS.MATCH_UPDATE, this.sendStats);
  }

  public getTournament = () => {
    return {
      matches: this.matches,
      ...this.tournament,
    };
  }

  public start = () => {
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
        tournament: this.getTournament(),
      },
    });
  }

  public continue = () => {
    this.playNextMatch();
  }

  private onTournamentEnd = () => {
    this.tournament.finished = true;
    this.tournament.waiting = false;
    this.sendStats();
  }

  private playNextMatch = () => {
    this.sendStats();
    this.tournament.waiting = false;
    this.tournament.ranking = this.matchmaker.getRanking();
    if (this.matchmaker.isFinished()) {
      this.onTournamentEnd();
    }
    const upcomingMatches = this.matches.filter(match => match.state === "upcoming");

    if (upcomingMatches.length < 1) {
      this.matches.push(...this.matchmaker.getRemainingMatches());
      this.playNextMatch();
      return;
    }

    const nextMatch = upcomingMatches[0];
    // Run the match
    const matchRunner = new MatchRunner(nextMatch, this.tournament.tournamentID);
    matchRunner.start();
  }

  private sendStats = (): void => {
    this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
      event: EVENTS.TOURNAMENT_STATS,
      namespace: this.tournament.lobby,
      payload: {
        ...this.getTournament(),
      },
    });
  }
}
