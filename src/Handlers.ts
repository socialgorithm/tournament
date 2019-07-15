// tslint:disable:max-classes-per-file

import { EventName } from "./EventName";
import { CreateMatchMessage, GameEndedMessage, GameInfoMessage, GameToPlayerMessage, MatchCreatedMessage, PlayerToGameMessage } from "./Messages";

export interface IEventHandler {
  eventName: EventName;
  handler: any;
}

export class CreateMatchEventHandler implements IEventHandler {
  public eventName: EventName.CreateMatch;
  public constructor(public handler: (message: CreateMatchMessage) => void) {}
}

export class MatchCreatedEventHandler implements IEventHandler {
  public eventName: EventName.MatchCreated;
  public constructor(public handler: (message: MatchCreatedMessage) => void) {}
}

export class GameEndedEventHandler implements IEventHandler {
  public eventName: EventName.GameEnded;
  public constructor(public handler: (message: GameEndedMessage) => void) {}
}

export class MatchEndedEventHandler implements IEventHandler {
  public eventName: EventName.MatchEnded;
  public constructor(public handler: () => void) {}
}

export class GameToPlayerEventHandler implements IEventHandler {
  public eventName: EventName.Game__Player;
  public constructor(public handler: (message: GameToPlayerMessage) => void) {}
}

export class PlayerToGameEventHandler implements IEventHandler {
  public eventName: EventName.Game__Player;
  public constructor(public handler: (message: PlayerToGameMessage) => void) {}
}

export class GameInfoEventHandler implements IEventHandler {
  public eventName: EventName.GameInfo;
  public constructor(public handler: (message: GameInfoMessage) => void) {}
}
