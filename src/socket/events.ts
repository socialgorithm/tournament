export enum EVENTS {
    // PubSub Events
    BROADCAST = "BROADCAST",
    BROADCAST_NAMESPACED = "BROADCAST_NAMESPACED",
    PLAYER_TO_GAME = "PLAYER_TO_GAME",
    SERVER_TO_PLAYER = "SERVER_TO_PLAYER",
    ADD_PLAYER_TO_NAMESPACE = "ADD_PLAYER_TO_NAMESPACE",
    MATCH_STARTED = "MATCH_STARTED",
    MATCH_ENDED = "MATCH_ENDED",
    GAME_ENDED = "GAME_ENDED",
    MATCH_UPDATE = "MATCH_UPDATE",
    // Socket Events
    LOBBY_CREATE = "lobby create",
    LOBBY_TOURNAMENT_START = "lobby tournament start",
    LOBBY_TOURNAMENT_STARTED = "lobby tournament started",
    LOBBY_TOURNAMENT_CONTINUE = "lobby tournament continue",
    LOBBY_PLAYER_KICK = "lobby player kick",
    LOBBY_PLAYER_BAN = "lobby player ban",
    LOBBY_JOIN = "lobby join",
    TOURNAMENT_STATS = "tournament stats",
}
