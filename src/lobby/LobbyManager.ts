import { Player } from "@socialgorithm/game-server/src/constants";
import PubSub from '../lib/PubSub';
import { EVENTS } from "../lib/events";
import { LobbyRunner } from "./LobbyRunner";

export class LobbyManager {
    private lobbyRunners: LobbyRunner[] = [];
    private pubSub: PubSub;

    constructor() {
        // Add PubSub listeners
        this.pubSub = new PubSub();
        this.pubSub.subscribe(EVENTS.LOBBY_CREATE, this.createLobby);
    }

    private createLobby = (data: any) => {
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