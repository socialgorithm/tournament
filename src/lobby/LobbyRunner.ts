import * as randomWord from "random-word";

import { TournamentRunner } from "./tournament/TournamentRunner";
import { Lobby } from "./Lobby";
import { Player } from "@socialgorithm/game-server/src/constants";

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