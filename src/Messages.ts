import { Game } from "./Game";
import { Match, MatchOptions } from "./Match";
import { Player } from "./Player";
import { TournamentOptions } from "./Tournament";

export type CreateMatchMessage = {
  players: Player[],
  options: MatchOptions,
};

export type MatchCreatedMessage = {
  playerTokens: {
    [name: string]: string,
  },
};

export type MatchEndedMessage = {
  matchID: string,
};

export type GameEndedMessage = Game;

export type GameInfoMessage = {
  name: string,
};

export type GameServerHandoffMessage = {
  gameServerAddress: string,
  matchID: string,
  token: string,
};

export type PlayerToGameMessage = {
  payload: any,
};

export type GameToPlayerMessage = PlayerToGameMessage;

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
