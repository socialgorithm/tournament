// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:gameRunner");

import * as io from "socket.io-client";

import { GAME_SOCKET_MESSAGE, Player } from "@socialgorithm/game-server";
import { GameEndedMessage, GameToPlayerMessage, GameUpdatedMessage } from "@socialgorithm/game-server/dist/GameMessage";
import { EVENTS } from "../../../../Events";
import PubSub from "../../../../PubSub";
import { Game } from "./Game";

export type GameRunnerOptions = {
    gameServerAddress: string,
};

export class GameRunner {
    private gameSocket: SocketIOClient.Socket;
    private pubSub: PubSub;

    constructor(private matchID: string, private game: Game, options: GameRunnerOptions) {
        // Game Server Socket Setup
        try {
            debug("Initialising Game Runner");
            debug("Connecting to %s", options.gameServerAddress);

            this.gameSocket = io(options.gameServerAddress, {
                reconnection: true,
                timeout: 2000,
            });

            this.gameSocket.on("connect", () => {
                debug(`Connected to Game Server, starting game`);
                this.start();
            });

            this.gameSocket.on(GAME_SOCKET_MESSAGE.GAME_UPDATED, this.onUpdate);
            this.gameSocket.on(GAME_SOCKET_MESSAGE.GAME_ENDED, this.onFinish);

            this.gameSocket.on(GAME_SOCKET_MESSAGE.GAME__PLAYER, (data: GameToPlayerMessage) => {
                this.onGameToPlayer(data.player, data.payload);
            });

            this.gameSocket.on("disconnect", () => {
                debug("Connection to Game Server %s lost!", options.gameServerAddress);
            });
        } catch (e) {
            debug("sg: Unable to connect to Game Server. %O", e);
        }

        // PubSub Subscriptions
        this.pubSub = new PubSub();
        this.pubSub.subscribe(EVENTS.PLAYER_TO_GAME, this.onPlayerToGame);
    }

    public close() {
        this.gameSocket.close();
    }

    /**
     * Play an individual game between two players
     */
    private start() {
        debug("Start game");
        this.gameSocket.emit(GAME_SOCKET_MESSAGE.START_GAME, {
            players: this.game.players,
        });
    }

    private onFinish = (message: GameEndedMessage) => {
        this.game.stats = message.payload;
        this.game.winner = message.winner;
        this.game.tie = message.tie;
        this.game.duration = message.duration;
        this.game.message = message.message;

        this.pubSub.unsubscribeAll();

        this.pubSub.publishNamespaced(
            this.matchID,
            EVENTS.GAME_ENDED,
            this.game,
        );
    }

    private onUpdate = (message: GameUpdatedMessage) => {
        this.game.stats = message.payload;
    }

    private onPlayerToGame = (payload: any) => {
        // receives all player messages, check if it belongs here
        if (this.game.players.indexOf(payload.player) < 0) {
            return;
        }
        // received message from player, relay it to the game server
        this.gameSocket.emit(GAME_SOCKET_MESSAGE.GAME__PLAYER, {
            payload: payload.data,
            player: payload.player,
        });
    }

    private onGameToPlayer = (player: Player, payload: any) => {
        this.pubSub.publish(EVENTS.SERVER_TO_PLAYER, {
            player,
            event: "game",
            payload,
        });
    }
}
