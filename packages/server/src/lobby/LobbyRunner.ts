import * as randomWord from "random-word";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("sg:lobbyRunner");

import { Lobby, Messages, Player } from "@socialgorithm/model";
import { Events } from "../pub-sub";
import PubSub from "../pub-sub/PubSub";
import { TournamentRunner } from "./tournament/TournamentRunner";

export class LobbyRunner {
  private readonly lobby: Lobby;
  private tournamentRunner: TournamentRunner;
  private pubSub: PubSub;
  private readonly expiresAt: Date;
  private adminConnected = false;

  constructor(admin: Player, fixedLobbyName: boolean) {
    this.lobby = {
      admin,
      bannedPlayers: [],
      players: [],
      token: fixedLobbyName ? "aaaaa-bbbbb" : `${randomWord()}-${randomWord()}`
    };

    // Add PubSub listeners
    this.pubSub = new PubSub();
    this.pubSub.subscribe(Events.LobbyJoin, this.addPlayerToLobby);
    this.pubSub.subscribe(Events.LobbyTournamentStart, this.startTournament);
    this.pubSub.subscribe(Events.LobbyTournamentContinue, this.continueTournament);
    this.pubSub.subscribe(Events.LobbyPlayerBan, this.banPlayer);
    this.pubSub.subscribe(Events.LobbyPlayerKick, this.kickPlayer);
    this.pubSub.subscribe(Events.PlayerDisconnected, this.removeDisconnectedPlayer);

    // Set expiry
    const expiresAt = new Date(); // now
    expiresAt.setHours(expiresAt.getHours() + 6);
    this.expiresAt = expiresAt;
  }

  public getLobby(): Lobby {
    const tournament = this.tournamentRunner ? this.tournamentRunner.getTournament() : null;

    return {
      tournament,
      ...this.lobby,
    };
  }

  public isExpired(): boolean {
    const now = new Date();
    return now > this.expiresAt;
  }

  public isInactive(): boolean {
    return this.lobby.players.length === 0 && !this.adminConnected;
  }

  public destroy(): void {
    if (this.tournamentRunner) {
      this.tournamentRunner.destroy();
    }
    this.pubSub.unsubscribeAll();
  }

  private addPlayerToLobby = (data: Messages.LOBBY_JOIN_MESSAGE) => {
    // add data.player to data.payload.token
    const player = data.player;
    const lobbyName = data.payload.token;
    const isSpectating = data.payload.spectating;

    if (lobbyName !== this.lobby.token) {
      return;
    }

    if (this.lobby.bannedPlayers.indexOf(player) > -1) {
      debug(`Refusing to add player ${player} to lobby ${lobbyName} due to ban`);
      return;
    }

    if (this.lobby.admin === player) {
      debug(`Setting admin connected in ${this.lobby}`);
      this.adminConnected = true;
    }

    if (!isSpectating && this.lobby.players.indexOf(player) < 0) {
      debug(`Pushing player ${player} into lobby players`);
      this.lobby.players.push(player);
    }

    const lobby = this.getLobby();

    // Join the lobby namespace
    this.pubSub.publish(Events.AddPlayerToNamespace, {
      namespace: lobbyName,
      player,
    });

    // Publish a lobby update
    this.pubSub.publish(Events.BroadcastNamespaced, {
      event: "connected",
      namespace: lobbyName,
      payload: {
        lobby,
      },
    });

    // Send join confirmation to player
    this.pubSub.publish(Events.ServerToPlayer, {
      event: "lobby joined",
      payload: {
        isAdmin: this.lobby.admin === player,
        lobby,
      },
      player,
    });

    if (isSpectating) {
      // Join the lobby info namespace
      this.pubSub.publish(Events.AddPlayerToNamespace, {
        namespace: `${lobbyName}-info`,
        player,
      });
    }

    debug("Added player %s to lobby %s", player, lobbyName);
  }

  private removeDisconnectedPlayer = (data: Messages.PlayerDisconnectedMessage) => {
    const disconnectedPlayer = data.player;
    const lobby = this.getLobby();

    const foundIndex = this.lobby.players.indexOf(disconnectedPlayer);
    if (foundIndex > -1) {
      debug(`Removing ${disconnectedPlayer} from ${lobby.token}`);
      this.lobby.players.splice(foundIndex, 1);
      // Publish a lobby update
      this.pubSub.publish(Events.BroadcastNamespaced, {
        event: "lobby player disconnected",
        namespace: lobby.token,
        payload: {
          lobby,
        },
      });
    }

    if (disconnectedPlayer === lobby.admin) {
      debug(`Setting admin disconnected in ${this.lobby}`);
      this.adminConnected = false;
    }
  }

  /**
   * Wrap any method in a check for the admin user
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private ifAdmin = (next: (lobbyName: string, data: any) => any) => (data: any) => {
    let lobbyName = data.payload.token;
    if (!lobbyName) {
      lobbyName = data.payload.lobbyToken;
    }
    if (data.player !== this.lobby.admin) {
      debug(`Refusing to perform action - ${data.player} is not admin for ${this.lobby.token}`);
      return;
    }
    if (lobbyName !== this.lobby.token) {
      debug(`Refusing to perform action - Request lobby name ${lobbyName} does not match lobby token ${this.lobby.token}`);
      return;
    }
    next(lobbyName, data);
  }

  // tslint:disable-next-line:member-ordering
  private startTournament = this.ifAdmin((lobbyName: string, data: Messages.LOBBY_TOURNAMENT_START_MESSAGE) => {
    if (this.tournamentRunner) {
      this.tournamentRunner.destroy();
    }

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
    this.pubSub.publish(Events.BroadcastNamespaced, {
      event: "lobby tournament continued",
      namespace: lobbyName,
      payload: this.getLobby(),
    });
  });

  // tslint:disable-next-line:member-ordering
  private kickPlayer = this.ifAdmin((lobbyName: string, data: Messages.LOBBY_PLAYER_KICK_MESSAGE) => {
    debug("Kicking player %s in lobby %s", data.player, lobbyName);

    const playerIndex = this.lobby.players.indexOf(data.player);
    this.lobby.players.splice(playerIndex, 1);

    this.pubSub.publish(Events.BroadcastNamespaced, {
      event: "lobby player kicked",
      namespace: lobbyName,
      payload: this.getLobby(),
    });

    // Send confirmation to player
    this.pubSub.publish(Events.ServerToPlayer, {
      event: "kicked",
      payload: null,
      player: data.player,
    });
  });

  // tslint:disable-next-line:member-ordering
  private banPlayer = this.ifAdmin((lobbyName: string, data: Messages.LOBBY_PLAYER_BAN_MESSAGE) => {
    debug("Banning player %s in lobby %s", data.player, lobbyName);

    const playerIndex = this.lobby.players.indexOf(data.player);
    this.lobby.players.splice(playerIndex, 1);

    if (this.lobby.bannedPlayers.indexOf(data.player) > -1) {
      return;
    }

    this.lobby.bannedPlayers.push(data.player);

    this.pubSub.publish(Events.BroadcastNamespaced, {
      event: "lobby player banned",
      namespace: lobbyName,
      payload: this.getLobby(),
    });

    // Send confirmation to player
    this.pubSub.publish(Events.ServerToPlayer, {
      event: "banned",
      payload: null,
      player: data.player,
    });
  });
}
