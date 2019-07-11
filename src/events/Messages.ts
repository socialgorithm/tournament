import { Player } from "@socialgorithm/game-server";
import { TournamentOptions } from "../lobby/tournament/TournamentRunner";

/**
 * PubSub/Socket API: Message Definitions
 */

export type SERVER_TO_PLAYER_MESSAGE = {
  player: Player,
  event: string,
  payload: any,
};

export type BROADCAST_NAMESPACED_MESSAGE = {
  namespace: string,
  event: string,
  payload: any,
};

export type ADD_PLAYER_TO_NAMESPACE_MESSAGE = {
  player: Player,
  namespace: string,
};

export type LOBBY_JOIN_MESSAGE = {
  player: Player,
  payload: {
    token: string,
    spectating: boolean,
  },
};

export type LOBBY_CREATE_MESSAGE = {
  player: Player,
};

export type LOBBY_TOURNAMENT_START_MESSAGE = {
  payload: {
    token: string,
    options: TournamentOptions,
    players: Player[],
  },
};

export type LOBBY_TOURNAMENT_CONTINUE_MESSAGE = {};

export type LOBBY_PLAYER_BAN_MESSAGE = {
  player: Player,
};

export type LOBBY_PLAYER_KICK_MESSAGE = {
  player: Player,
};

export type PLAYER_DISCONNECTED_MESSAGE = {
  player: Player,
};
