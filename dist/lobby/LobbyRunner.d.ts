import { Player } from "@socialgorithm/game-server";
export declare class LobbyRunner {
    expiresAt: Date;
    private lobby;
    private tournamentRunner;
    private pubSub;
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
    private addPlayerToLobby;
    private ifAdmin;
    private startTournament;
    private continueTournament;
    private kickPlayer;
    private banPlayer;
}
