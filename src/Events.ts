// tslint:disable: max-classes-per-file

import { CreateMatchMessage, GameEndedMessage, GameInfoMessage, GameServerHandoffMessage, GameToPlayerMessage, MatchCreatedMessage, MatchEndedMessage, PlayerToGameMessage } from "./Messages";

export enum EventName {
  CreateMatch,
  MatchCreated,
  MatchUpdated,
  MatchEnded,
  GameUpdated,
  GameEnded,
  GameInfo,
  GameList,
  GameServerHandoff,
  GameServerStatusUpdate,
  Game__Player,
  PlayerDisconnected,
  ServerToPlayer,
}

export interface IEvent {
  name: EventName;
  message: any;
}

export class CreateMatchEvent implements IEvent {
  public name: EventName.CreateMatch;
  public constructor(public message: CreateMatchMessage) {}
}

export class MatchCreatedEvent implements IEvent {
  public name: EventName.MatchCreated;
  public constructor(public message: MatchCreatedMessage) {}
}

export class MatchEndedEvent implements IEvent {
  public name: EventName.MatchEnded;
  public constructor(public message: MatchEndedMessage) {}
}

export class GameEndedEvent implements IEvent {
  public name: EventName.GameEnded;
  public constructor(public message: GameEndedMessage) {}
}

export class GameServerHandoffEvent implements IEvent {
  public name: EventName.GameServerHandoff;
  public constructor(public message: GameServerHandoffMessage) {}
}

export class GameInfoEvent implements IEvent {
  public name: EventName.GameInfo;
  public constructor(public message: GameInfoMessage) {}
}

export class PlayerToGameEvent implements IEvent {
  public name: EventName.Game__Player;
  public constructor(public message: PlayerToGameMessage) {}
}

export class GameToPlayerEvent implements IEvent {
  public name: EventName.Game__Player;
  public constructor(public message: GameToPlayerMessage) {}
}
