// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:lobbyManager");

import PubSub from "../lib/PubSub";
import { EVENTS } from "../socket/events";
import { LOBBY_CREATE_MESSAGE, LOBBY_JOIN_MESSAGE } from "../socket/messages";
import { LobbyRunner } from "./LobbyRunner";

export class LobbyManager {
    private lobbyRunners: LobbyRunner[] = [];
    private pubSub: PubSub;

    constructor() {
        // Add PubSub listeners
        this.pubSub = new PubSub();
        this.pubSub.subscribe(EVENTS.LOBBY_CREATE, this.createLobby);
        this.pubSub.subscribe(EVENTS.LOBBY_JOIN, this.checkLobby);
    }

    private createLobby = (data: LOBBY_CREATE_MESSAGE) => {
        const admin = data.player;
        const lobbyRunner = new LobbyRunner(admin);
        this.lobbyRunners.push(lobbyRunner);

        // Join the lobby namespace
        this.pubSub.publish(EVENTS.ADD_PLAYER_TO_NAMESPACE, {
            namespace: lobbyRunner.getLobby().token,
            player: data.player,
        });

        debug("Created lobby %s", lobbyRunner.getLobby().token);

        // Send confirmation to player
        this.pubSub.publish(EVENTS.SERVER_TO_PLAYER, {
            event: "lobby created",
            payload: {
                lobby: lobbyRunner.getLobby(),
            },
            player: data.player,
        });
    }

    private checkLobby = (data: LOBBY_JOIN_MESSAGE) => {
        const lobbyRunner = this.lobbyRunners.find(
            each => each.getLobby().token === data.payload.token,
        );
        if (!lobbyRunner) {
            // Joining a non-existing lobby
            this.pubSub.publish(EVENTS.SERVER_TO_PLAYER, {
                event: EVENTS.LOBBY_EXCEPTION,
                payload: {
                    error: "Unable to join lobby, ensure token is correct",
                },
                player: data.player,
            });
        }
    }
}
