import { EventName } from "./Events";
import { CreateMatchMessage, GameEndedMessage, GameToPlayerMessage, MatchCreatedMessage, MatchEndedMessage, PlayerToGameMessage } from "./Messages";
export interface IEventHandler {
    eventName: EventName;
    handler: any;
}
export declare class CreateMatchEventHandler implements IEventHandler {
    handler: (message: CreateMatchMessage) => void;
    eventName: EventName.CreateMatch;
    constructor(handler: (message: CreateMatchMessage) => void);
}
export declare class MatchCreatedEventHandler implements IEventHandler {
    handler: (message: MatchCreatedMessage) => void;
    eventName: EventName.MatchCreated;
    constructor(handler: (message: MatchCreatedMessage) => void);
}
export declare class GameEndedEventHandler implements IEventHandler {
    handler: (message: GameEndedMessage) => void;
    eventName: EventName.GameEnded;
    constructor(handler: (message: GameEndedMessage) => void);
}
export declare class MatchEndedEventHandler implements IEventHandler {
    handler: (message: MatchEndedMessage) => void;
    eventName: EventName.MatchEnded;
    constructor(handler: (message: MatchEndedMessage) => void);
}
export declare class GameToPlayerEventHandler implements IEventHandler {
    handler: (message: GameToPlayerMessage) => void;
    eventName: EventName.Game__Player;
    constructor(handler: (message: GameToPlayerMessage) => void);
}
export declare class PlayerToGameEventHandler implements IEventHandler {
    handler: (message: PlayerToGameMessage) => void;
    eventName: EventName.Game__Player;
    constructor(handler: (message: PlayerToGameMessage) => void);
}
