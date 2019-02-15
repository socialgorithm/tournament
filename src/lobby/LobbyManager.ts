import { Player } from "@socialgorithm/game-server/src/constants";
import PubSub from '../lib/PubSub';
import { EVENTS } from "../socket/events";
import { LobbyRunner } from "./LobbyRunner";
import { LOBBY_CREATE_MESSAGE } from "../socket/messages";

export class LobbyManager {
    private lobbyRunners: LobbyRunner[] = [];
    private pubSub: PubSub;

    constructor() {
        // Add PubSub listeners
        this.pubSub = new PubSub();
        this.pubSub.subscribe(EVENTS.LOBBY_CREATE, this.createLobby);
    }

    private createLobby = (data: LOBBY_CREATE_MESSAGE) => {
        const admin = data.player;
        const lobbyRunner = new LobbyRunner(admin);
        this.lobbyRunners.push(lobbyRunner);

        // Join the lobby namespace
        this.pubSub.publish(EVENTS.ADD_PLAYER_TO_NAMESPACE, {
            player: data.player,
            namespace: lobbyRunner.lobby.token,
        });

         // Send confirmation to player
         this.pubSub.publish(EVENTS.SERVER_TO_PLAYER, {
            player: data.player,
            event: 'lobby created',
            payload: {
                lobby: {
                    tournament: lobbyRunner.tournamentRunner.tournament,
                    ...lobbyRunner.lobby,
                },
            },
        });
    }
}