import { CreateMatchMessage, GameEndedMessage, GameInfoMessage, GameServerHandoffMessage, GameToPlayerMessage, MatchCreatedMessage, PlayerToGameMessage } from "./Messages";
export declare enum EventName {
    CreateMatch = 0,
    MatchCreated = 1,
    MatchUpdated = 2,
    MatchEnded = 3,
    GameUpdated = 4,
    GameEnded = 5,
    GameInfo = 6,
    GameList = 7,
    GameServerHandoff = 8,
    GameServerStatusUpdate = 9,
    Game__Player = 10,
    PlayerDisconnected = 11,
    ServerToPlayer = 12
}
export interface IEvent {
    name: EventName;
    message?: any;
}
export declare class CreateMatchEvent implements IEvent {
    message: CreateMatchMessage;
    name: EventName.CreateMatch;
    constructor(message: CreateMatchMessage);
}
export declare class MatchCreatedEvent implements IEvent {
    message: MatchCreatedMessage;
    name: EventName.MatchCreated;
    constructor(message: MatchCreatedMessage);
}
export declare class MatchEndedEvent implements IEvent {
    name: EventName.MatchEnded;
    message: null;
}
export declare class GameEndedEvent implements IEvent {
    message: GameEndedMessage;
    name: EventName.GameEnded;
    constructor(message: GameEndedMessage);
}
export declare class GameServerHandoffEvent implements IEvent {
    message: GameServerHandoffMessage;
    name: EventName.GameServerHandoff;
    constructor(message: GameServerHandoffMessage);
}
export declare class GameInfoEvent implements IEvent {
    message: GameInfoMessage;
    name: EventName.GameInfo;
    constructor(message: GameInfoMessage);
}
export declare class PlayerToGameEvent implements IEvent {
    message: PlayerToGameMessage;
    name: EventName.Game__Player;
    constructor(message: PlayerToGameMessage);
}
export declare class GameToPlayerEvent implements IEvent {
    message: GameToPlayerMessage;
    name: EventName.Game__Player;
    constructor(message: GameToPlayerMessage);
}
