import { EventName } from "./EventName";
import * as Messages from "./Messages";
export interface IEvent {
    name: EventName;
    message?: any;
}
export declare class CreateMatchEvent implements IEvent {
    message: Messages.CreateMatchMessage;
    name: EventName.CreateMatch;
    constructor(message: Messages.CreateMatchMessage);
}
export declare class MatchCreatedEvent implements IEvent {
    message: Messages.MatchCreatedMessage;
    name: EventName.MatchCreated;
    constructor(message: Messages.MatchCreatedMessage);
}
export declare class MatchEndedEvent implements IEvent {
    name: EventName.MatchEnded;
    message: null;
}
export declare class GameEndedEvent implements IEvent {
    message: Messages.GameEndedMessage;
    name: EventName.GameEnded;
    constructor(message: Messages.GameEndedMessage);
}
export declare class GameServerHandoffEvent implements IEvent {
    message: Messages.GameServerHandoffMessage;
    name: EventName.GameServerHandoff;
    constructor(message: Messages.GameServerHandoffMessage);
}
export declare class GameInfoEvent implements IEvent {
    message: Messages.GameInfoMessage;
    name: EventName.GameInfo;
    constructor(message: Messages.GameInfoMessage);
}
export declare class PlayerToGameEvent implements IEvent {
    message: Messages.PlayerToGameMessage;
    name: EventName.Game__Player;
    constructor(message: Messages.PlayerToGameMessage);
}
export declare class GameToPlayerEvent implements IEvent {
    message: Messages.GameToPlayerMessage;
    name: EventName.Game__Player;
    constructor(message: Messages.GameToPlayerMessage);
}
export declare class GameListEvent implements IEvent {
    message: Messages.GameServerStatus[];
    name: EventName.GameList;
    constructor(message: Messages.GameServerStatus[]);
}
export declare class PlayerDisconnectedEvent implements IEvent {
    message: Messages.PlayerDisconnectedMessage;
    name: EventName.PlayerDisconnected;
    constructor(message: Messages.PlayerDisconnectedMessage);
}
