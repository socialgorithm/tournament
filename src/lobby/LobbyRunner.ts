import * as randomWord from "random-word";

import { Player } from "./Player";
import { TournamentRunner } from "./tournament/TournamentRunner";
import { Lobby } from "./Lobby";

export class LobbyRunner {
    private lobby: Lobby;
    private tournamentRunner: TournamentRunner;

    constructor(admin: Player) {
        this.lobby = {
            admin,
            name: `${randomWord()}-${randomWord()}`,
            players: [],
            bannedPlayers: [],
        };
    }
}