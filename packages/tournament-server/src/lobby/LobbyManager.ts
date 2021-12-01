// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("sg:lobbyManager");

import { LegacyEvents, Messages } from "@socialgorithm/model";
import { Events } from "../pub-sub";
import PubSub from "../pub-sub/PubSub";
import { LobbyRunner } from "./LobbyRunner";

export class LobbyManager {
    private lobbyRunners: LobbyRunner[] = [];
    private pubSub: PubSub;
    private fixedLobbyName: boolean;

    constructor(fixedLobbyName: boolean) {
        // Add PubSub listeners
        this.fixedLobbyName = fixedLobbyName;
        this.pubSub = new PubSub();
        this.pubSub.subscribe(Events.LobbyCreate, this.createLobby);
        this.pubSub.subscribe(Events.LobbyJoin, this.checkLobby);

        setInterval(() => this.deleteExpiredLobbies(), 1000 * 60);
    }

    private createLobby = (data: Messages.LOBBY_CREATE_MESSAGE) => {
        const admin = data.player;
        const lobbyRunner = new LobbyRunner(admin, this.fixedLobbyName);
        this.lobbyRunners.push(lobbyRunner);

        // Join the lobby namespace
        this.pubSub.publish(Events.AddPlayerToNamespace, {
            namespace: lobbyRunner.getLobby().token,
            player: data.player,
        });

        debug("Created lobby %s", lobbyRunner.getLobby().token);

        // Send confirmation to player
        this.pubSub.publish(Events.ServerToPlayer, {
            event: "lobby created",
            payload: {
                lobby: lobbyRunner.getLobby(),
            },
            player: data.player,
        });
    }

    private checkLobby = (data: Messages.LOBBY_JOIN_MESSAGE) => {
        const lobbyRunner = this.lobbyRunners.find(
            each => each.getLobby().token === data.payload.token,
        );
        if (!lobbyRunner) {
            // Joining a non-existing lobby
            this.pubSub.publish(Events.ServerToPlayer, {
                event: LegacyEvents.EVENTS.LOBBY_EXCEPTION,
                payload: {
                    error: "Unable to join lobby, ensure token is correct",
                },
                player: data.player,
            });
        }
    }

    private deleteExpiredLobbies = () => {
      debug("Deleting expired lobbies");
      this.lobbyRunners = this.lobbyRunners.filter(lobbyRunner => {
        const isExpired = lobbyRunner.isExpired() || lobbyRunner.isInactive();
        if (isExpired) {
          lobbyRunner.destroy();
          debug(`Will delete ${lobbyRunner.getLobby().token}`);
        }
        return !isExpired;
      });
    }
}
