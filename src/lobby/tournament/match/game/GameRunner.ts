import { GameEndPayload, GameMessage, GameUpdatePayload, Player, SOCKET_MESSAGE } from "@socialgorithm/game-server/dist/constants";
import * as io from "socket.io-client";

import PubSub from "../../../../lib/PubSub";
import { EVENTS } from "../../../../socket/events";
import { Game } from "./Game";

export type GameRunnerOptions = {
    host?: string,
    proxy?: string,
};

export class GameRunner {
    private gameSocket: any;
    private pubSub: PubSub;

    constructor(private matchID: string, private game: Game, options: GameRunnerOptions) {
        // Game Server Socket Setup
        try {
            let host = options.host || "localhost:5433";
            if (host.substr(0, 4) !== "http") {
                host = "http://" + host;
            }

            console.log("Initialising Game Runner");
            console.log("Connecting to " + host);

            this.gameSocket = io(host, {
                reconnection: true,
                timeout: 2000,
            });

            this.gameSocket.on("connect", () => {
                console.log(`Connected to Game Server, starting game`);
                this.start();
            });

            this.gameSocket.on(SOCKET_MESSAGE.GAME_MESSAGE, (data: GameMessage) => {
                console.log("Received a game message", data);
                this.onGameToServer(data);
            });

            this.gameSocket.on(SOCKET_MESSAGE.PLAYER_MESSAGE, (data: any) => {
                console.log("Proxy message to player", data);
                this.onGameToPlayer(data.player, data.payload);
            });

            this.gameSocket.on("disconnect", () => {
                console.log("Connection lost!");
            });
        } catch (e) {
            console.log("tournament-server: Unable to connect to Game Server:", e);
        }

        // PubSub Subscriptions
        this.pubSub = new PubSub();
        this.pubSub.subscribe(EVENTS.PLAYER_TO_GAME, this.onPlayerToGame);
    }

    /**
     * Play an individual game between two players
     */
    private start() {
        this.sendToGame({
            payload: {
                players: this.game.players,
            },
            type: "START",
        });
    }

    private onFinish(data: GameEndPayload) {
        this.game.stats = data.stats;
        this.game.winner = data.winner;
        this.game.tie = data.tie;
        this.game.duration = data.duration;
        this.game.message = data.message;

        this.pubSub.unsubscribeAll();

        this.pubSub.publishNamespaced(
            this.matchID,
            EVENTS.GAME_ENDED,
            null,
        );
    }

    private onUpdate(data: GameUpdatePayload) {
        this.game.stats = data.stats;
    }

    private onGameToServer(data: GameMessage) {
        switch (data.type) {
            case "UPDATE":
                this.onUpdate(data.payload);
                break;
            case "END":
                this.onFinish(data.payload);
                break;
            default:
                console.error("Unsupported message from game server");
        }
    }

    private onPlayerToGame(data: any) {
        // receives all player messages, check if it belongs here
        if (this.game.players.indexOf(data.player) < 0) {
            return;
        }
        // received message from player, relay it to the game server
        this.gameSocket.send(SOCKET_MESSAGE.PLAYER_MESSAGE, {
            payload: data.payload,
            player: data.player,
        });
    }

    private onGameToPlayer(player: Player, data: any) {
        // game server -> player
    }

    private sendToGame(data: any) {
        this.gameSocket.send(SOCKET_MESSAGE.GAME_MESSAGE, data);
    }
}
