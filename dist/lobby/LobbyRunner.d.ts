import { Player } from "@socialgorithm/game-server";
export declare class LobbyRunner {
    private lobby;
    private tournamentRunner;
    private pubSub;
    private expiresAt;
    private adminConnected;
    constructor(admin: Player);
    getLobby(): {
        admin: string;
        token: string;
        players: string[];
        bannedPlayers: string[];
        tournament: {
            tournamentID: string;
            players: string[];
            lobby: string;
            options: import("./tournament/TournamentRunner").TournamentOptions;
            started: boolean;
            finished: boolean;
            ranking: string[];
            waiting: boolean;
            matches: import("./tournament/match/Match").Match[];
        };
    };
    isExpired(): boolean;
    isInactive(): boolean;
    destroy(): void;
    private addPlayerToLobby;
    private removeDisconnectedPlayer;
    private ifAdmin;
    private startTournament;
    private continueTournament;
    private kickPlayer;
    private banPlayer;
}
