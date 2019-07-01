import * as randomWord from "random-word";
// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:lobbyRunner");

import { Player } from "@socialgorithm/game-server";
import { EVENTS } from "../Events";
import { LOBBY_JOIN_MESSAGE, LOBBY_PLAYER_BAN_MESSAGE, LOBBY_PLAYER_KICK_MESSAGE, LOBBY_TOURNAMENT_START_MESSAGE } from "../Messages";
import PubSub from "../PubSub";
import { Lobby } from "./Lobby";
import { TournamentRunner } from "./tournament/TournamentRunner";

export class LobbyRunner {
  private lobby: Lobby;
  private tournamentRunner: TournamentRunner;
  private pubSub: PubSub;

  constructor(admin: Player) {
    this.lobby = {
      admin,
      bannedPlayers: [],
      players: [],
      token: `${randomWord()}-${randomWord()}`,
    };

    // Add PubSub listeners
    this.pubSub = new PubSub();
    this.pubSub.subscribe(EVENTS.LOBBY_JOIN, this.addPlayerToLobby);
    this.pubSub.subscribe(EVENTS.LOBBY_TOURNAMENT_START, this.startTournament);
    this.pubSub.subscribe(EVENTS.LOBBY_TOURNAMENT_CONTINUE, this.continueTournament);
    this.pubSub.subscribe(EVENTS.LOBBY_PLAYER_BAN, this.banPlayer);
    this.pubSub.subscribe(EVENTS.LOBBY_PLAYER_KICK, this.kickPlayer);
  }

  public getLobby() {
    const tournament = this.tournamentRunner ? this.tournamentRunner.getTournament() : null;

    return {
      tournament,
      ...this.lobby,
    };
  }

  private addPlayerToLobby = (data: LOBBY_JOIN_MESSAGE) => {
    // add data.player to data.payload.token
    const player = data.player;
    const lobbyName = data.payload.token;
    const isSpectating = data.payload.spectating;

    if (lobbyName !== this.lobby.token) {
      return;
    }

    if (this.lobby.bannedPlayers.indexOf(player) > -1) {
      return;
    }

    if (!isSpectating && this.lobby.players.indexOf(player) < 0) {
      this.lobby.players.push(player);
    }

    const lobby = this.getLobby();

    // Join the lobby namespace
    this.pubSub.publish(EVENTS.ADD_PLAYER_TO_NAMESPACE, {
      namespace: lobbyName,
      player,
    });

    // Publish a lobby update
    this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
      event: "connected",
      namespace: lobbyName,
      payload: {
        lobby,
      },
    });

    // Send join confirmation to player
    this.pubSub.publish(EVENTS.SERVER_TO_PLAYER, {
      event: "lobby joined",
      payload: {
        isAdmin: this.lobby.admin === player,
        lobby,
      },
      player,
    });

    if (isSpectating) {
      // Join the lobby info namespace
      this.pubSub.publish(EVENTS.ADD_PLAYER_TO_NAMESPACE, {
        namespace: `${lobbyName}-info`,
        player,
      });
    }

    debug("Added player %s to lobby %s", player, lobbyName);
  }

  /**
   * Wrap any method in a check for the admin user
   */
  private ifAdmin = (next: any) => (data: any) => {
    const lobbyName = data.payload.token;
    if (data.player !== this.lobby.admin || lobbyName !== this.lobby.token) {
      return;
    }
    next(lobbyName, data);
  }

  // tslint:disable-next-line:member-ordering
  private startTournament = this.ifAdmin((lobbyName: string, data: LOBBY_TOURNAMENT_START_MESSAGE) => {
    this.tournamentRunner = new TournamentRunner(
      data.payload.options,
      this.lobby.players,
      this.lobby.token,
    );

    debug("Starting tournament in lobby %s", lobbyName);

    this.tournamentRunner.start();
  });

  // tslint:disable-next-line:member-ordering
  private continueTournament = this.ifAdmin((lobbyName: string) => {
    this.tournamentRunner.continue();

    debug("Continue tournament in lobby %s", lobbyName);

    // Notify
    this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
      event: "lobby tournament continued",
      namespace: lobbyName,
      payload: this.getLobby(),
    });
  });

  // tslint:disable-next-line:member-ordering
  private kickPlayer = this.ifAdmin((lobbyName: string, data: LOBBY_PLAYER_KICK_MESSAGE) => {
    const playerIndex = this.lobby.players.indexOf(data.player);
    this.lobby.players.splice(playerIndex, 1);

    debug("Kick player %s in lobby %s", data.player, lobbyName);

    this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
      event: "lobby player kicked",
      namespace: lobbyName,
      payload: this.getLobby(),
    });

    // Send confirmation to player
    this.pubSub.publish(EVENTS.SERVER_TO_PLAYER, {
      event: "kicked",
      payload: null,
      player: data.player,
    });
  });

  // tslint:disable-next-line:member-ordering
  private banPlayer = this.ifAdmin((lobbyName: string, data: LOBBY_PLAYER_BAN_MESSAGE) => {
    const playerIndex = this.lobby.players.indexOf(data.player);
    this.lobby.players.splice(playerIndex, 1);

    if (this.lobby.bannedPlayers.indexOf(data.player) > -1) {
      return;
    }

    this.lobby.bannedPlayers.push(data.player);

    debug("Ban player %s in lobby %s", data.player, lobbyName);

    this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
      event: "lobby player banned",
      namespace: lobbyName,
      payload: this.getLobby(),
    });

    // Send confirmation to player
    this.pubSub.publish(EVENTS.SERVER_TO_PLAYER, {
      event: "banned",
      payload: null,
      player: data.player,
    });
  });
}
