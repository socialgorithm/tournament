// tslint:disable: max-classes-per-file

import * as Messages from "./Messages";

export enum EventName {
  CreateMatch = "CreateMatch",
  MatchCreated = "MatchCreated",
  MatchUpdated = "MatchUpdated",
  MatchEnded = "MatchEnded",
  GameUpdated = "GameUpdated",
  GameEnded = "GameEnded",
  GameInfo = "GameInfo",
  GameList = "GameList",
  GameServerHandoff = "GameServerHandoff",
  Game__Player = "Game__Player",
  PlayerDisconnected = "PlayerDisconnected",
  ServerToPlayer = "ServerToPlayer",
}

export interface IEvent {
  name: EventName;
  message?: any;
}

export class CreateMatchEvent implements IEvent {
  public name: EventName.CreateMatch;
  public constructor(public message: Messages.CreateMatchMessage) {}
}

export class MatchCreatedEvent implements IEvent {
  public name: EventName.MatchCreated;
  public constructor(public message: Messages.MatchCreatedMessage) {}
}

export class MatchEndedEvent implements IEvent {
  public name: EventName.MatchEnded;
  public message: null;
}

export class GameEndedEvent implements IEvent {
  public name: EventName.GameEnded;
  public constructor(public message: Messages.GameEndedMessage) {}
}

export class GameServerHandoffEvent implements IEvent {
  public name: EventName.GameServerHandoff;
  public constructor(public message: Messages.GameServerHandoffMessage) {}
}

export class GameInfoEvent implements IEvent {
  public name: EventName.GameInfo;
  public constructor(public message: Messages.GameInfoMessage) {}
}

export class PlayerToGameEvent implements IEvent {
  public name: EventName.Game__Player;
  public constructor(public message: Messages.PlayerToGameMessage) {}
}

export class GameToPlayerEvent implements IEvent {
  public name: EventName.Game__Player;
  public constructor(public message: Messages.GameToPlayerMessage) {}
}

export class GameListEvent implements IEvent {
  public name: EventName.GameList;
  public constructor(public message: Messages.GameServerStatus[]) {}
}

export class PlayerDisconnectedEvent implements IEvent {
  public name: EventName.PlayerDisconnected;
  public constructor(public message: Messages.PlayerDisconnectedMessage) {}
}
