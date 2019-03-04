import { Player } from "@socialgorithm/game-server/src/constants";
import { Lobby } from "./Lobby";
import { TournamentRunner } from "./tournament/TournamentRunner";
export declare class LobbyRunner {
    lobby: Lobby;
    tournamentRunner: TournamentRunner;
    private pubSub;
    constructor(admin: Player);
    private addPlayerToLobby;
    private ifAdmin;
    private startTournament;
    private continueTournament;
    private kickPlayer;
    private banPlayer;
}
