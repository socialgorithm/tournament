// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:tournamentRunner");

import { v4 as uuid } from "uuid";

import { Match, MatchOptions, Player, PlayerRank, Tournament, TournamentOptions } from "@socialgorithm/model";
import { EVENTS } from "@socialgorithm/model/dist/LegacyEvents";
import { Events } from "../../pub-sub";
import PubSub from "../../pub-sub/PubSub";
import DoubleEliminationMatchmaker from "./matchmaker/DoubleEliminationMatchmaker";
import FreeForAllMatchmaker from "./matchmaker/FreeForAllMatchmaker";
import IMatchMaker from "./matchmaker/MatchMaker";
import { MatchRunner } from "./MatchRunner";

export class TournamentRunner {
  private tournament: Tournament;
  private pubSub: PubSub;
  private matchmaker: IMatchMaker;
  private matches: Match[] = [];
  private currentMatchRunner?: MatchRunner = null;

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
    this.pubSub.subscribeNamespaced(this.tournament.tournamentID, Events.MatchEnded, this.onMatchEnd);
    this.pubSub.subscribeNamespaced(this.tournament.tournamentID, Events.MatchUpdated, this.sendStats);
  }

  public getTournament = () => {
    return {
      matches: this.matches,
      ...this.tournament,
    };
  }

  public start = () => {
    if (this.tournament.started) {
      debug("Tournament already started, not starting %O", this.getTournament());
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
    this.pubSub.publish(Events.BroadcastNamespaced, {
      event: EVENTS.LOBBY_TOURNAMENT_STARTED,
      namespace: this.tournament.lobby,
      payload: {
        tournament: this.getTournament(),
      },
    });

    if (this.tournament.options.autoPlay) {
      this.continue();
    }
  }

  public continue = () => {
    this.playNextMatch();
  }

  public destroy = () => {
    this.pubSub.unsubscribeAll();
  }

  private onTournamentEnd = () => {
    debug("Tournament Ended in %s", this.tournament.lobby);
    this.tournament.finished = true;
    this.tournament.waiting = false;
    this.matchmaker.updateStats(this.matches, true);
    this.sendStats();
  }

  private onMatchEnd = (match: Match) => {
    this.tournament.waiting = !this.tournament.options.autoPlay;
    this.matchmaker.updateRealtimeStats(match);
    this.tournament.ranking = this.matchmaker.getRanking();
    this.sendStats();

    if (this.tournament.waiting) {
      return;
    }

    this.playNextMatch();
  }

  private playNextMatch = () => {
    this.tournament.ranking = this.matchmaker.getRanking();
    if (this.matchmaker.isFinished()) {
      this.onTournamentEnd();
      return;
    }

    const upcomingMatches = this.matches.filter(match => match.state === "upcoming");

    if (upcomingMatches.length < 1) {
      this.matchmaker.updateStats(this.matches);
      const remainingMatches = this.matchmaker.getRemainingMatches();
      if (!remainingMatches || remainingMatches.length < 1) {
        this.onTournamentEnd();
        return;
      } else {
        this.matches.push(...remainingMatches);
        this.playNextMatch();
        return;
      }
    }

    const nextMatch = upcomingMatches[0];
    // Run the match
    this.currentMatchRunner = new MatchRunner(
      nextMatch,
      this.tournament.tournamentID,
      this.tournament.options.gameAddress,
    );
  }

  private sendStats = (): void => {
    this.pubSub.publish(Events.BroadcastNamespaced, {
      event: EVENTS.TOURNAMENT_STATS,
      namespace: this.tournament.lobby,
      payload: {
        ...this.getTournament(),
      },
    });
  }
}
