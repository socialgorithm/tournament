import * as randomWord from "random-word";

import { TournamentRunner } from "./tournament/TournamentRunner";
import { Lobby } from "./Lobby";
import { Player } from "@socialgorithm/game-server/src/constants";
import PubSub from '../lib/PubSub';
import { EVENTS } from "../socket/events";
import { LOBBY_JOIN_MESSAGE, LOBBY_PLAYER_KICK_MESSAGE, LOBBY_PLAYER_BAN_MESSAGE } from "../socket/messages";

export class LobbyRunner {
    public lobby: Lobby;
    public tournamentRunner: TournamentRunner;
    private pubSub: PubSub;

    constructor(admin: Player) {
        this.lobby = {
            admin,
            token: `${randomWord()}-${randomWord()}`,
            players: [],
            bannedPlayers: [],
        };

        this.tournamentRunner = new TournamentRunner(
            {
                type: 'test',
            },
            this.lobby.players,
            this.lobby.token
        );

        // Add PubSub listeners
        this.pubSub = new PubSub();
        this.pubSub.subscribe(EVENTS.LOBBY_JOIN, this.addPlayerToLobby);
        this.pubSub.subscribe(EVENTS.LOBBY_TOURNAMENT_START, this.startTournament);
        this.pubSub.subscribe(EVENTS.LOBBY_TOURNAMENT_CONTINUE, this.continueTournament);
        this.pubSub.subscribe(EVENTS.LOBBY_PLAYER_BAN, this.banPlayer);
        this.pubSub.subscribe(EVENTS.LOBBY_PLAYER_KICK, this.kickPlayer);
    }

    private addPlayerToLobby = (data: LOBBY_JOIN_MESSAGE) => {
        // add data.player to data.payload.token
        const player = data.player;
        const lobbyName = data.payload.token;
        const isSpectating = data.payload.spectating;

        if (lobbyName !== this.lobby.token) {
            return;
        }

        if (this.lobby.bannedPlayers.indexOf(player) > -1) {
            return;
        }

        if (!isSpectating && this.lobby.players.indexOf(player) < 0) {
            this.lobby.players.push(player);
        }

        // Join the lobby namespace
        this.pubSub.publish(EVENTS.ADD_PLAYER_TO_NAMESPACE, {
            player,
            namespace: lobbyName,
        });

        // Publish a lobby update
        this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
            namespace: lobbyName,
            event: 'connected',
            payload: {
                lobby: {
                    tournament: this.tournamentRunner.tournament,
                    ...this.lobby,
                },
            },
        });

        // Send join confirmation to player
        this.pubSub.publish(EVENTS.SERVER_TO_PLAYER, {
            player,
            event: 'lobby joined',
            payload: {
                isAdmin: this.lobby.admin === player,
                lobby: {
                    tournament: this.tournamentRunner.tournament,
                    ...this.lobby,
                },
            },
        });

        if (isSpectating) {
            // Join the lobby info namespace
            this.pubSub.publish(EVENTS.ADD_PLAYER_TO_NAMESPACE, {
                player,
                namespace: `${lobbyName}-info`,
            });
        }
    }

    /**
     * Wrap any method in a check for the admin user
     */
    private ifAdmin = (next: any) => (data: any) => {
        const lobbyName = data.payload.token;
        if (data.player !== this.lobby.admin || lobbyName !== this.lobby.token) {
            return;
        }
        next(lobbyName, data);
    };

    private startTournament = this.ifAdmin((lobbyName: string) => {
        this.tournamentRunner.start();

        // Notify
        this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
            namespace: lobbyName,
            event: 'lobby tournament started',
            payload: this.lobby,
        });
    });

    private continueTournament = this.ifAdmin((lobbyName: string) => {
        this.tournamentRunner.continue();

         // Notify
         this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
            namespace: lobbyName,
            event: 'lobby tournament continued',
            payload: this.lobby,
        });
    });

    private kickPlayer = this.ifAdmin((lobbyName: string, data: LOBBY_PLAYER_KICK_MESSAGE) => {
        const playerIndex = this.lobby.players.indexOf(data.player);
        this.lobby.players.splice(playerIndex, 1);

        this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
            namespace: lobbyName,
            event: 'lobby player kicked',
            payload: this.lobby,
        });

         // Send confirmation to player
         this.pubSub.publish(EVENTS.SERVER_TO_PLAYER, {
            player: data.player,
            event: 'kicked',
            payload: null,
        });
    });

    private banPlayer = this.ifAdmin((lobbyName: string, data: LOBBY_PLAYER_BAN_MESSAGE) => {
        const playerIndex = this.lobby.players.indexOf(data.player);
        this.lobby.players.splice(playerIndex, 1);

        if (this.lobby.bannedPlayers.indexOf(data.player) > -1) {
            return;
        }

        this.lobby.bannedPlayers.push(data.player);

        this.pubSub.publish(EVENTS.BROADCAST_NAMESPACED, {
            namespace: lobbyName,
            event: 'lobby player banned',
            payload: this.lobby,
        });

         // Send confirmation to player
         this.pubSub.publish(EVENTS.SERVER_TO_PLAYER, {
            player: data.player,
            event: 'banned',
            payload: null,
        });
    });
}