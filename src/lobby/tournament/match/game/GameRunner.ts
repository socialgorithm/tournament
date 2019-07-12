// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:gameRunner");

import * as io from "socket.io-client";

import { EVENTS, Game, GAME_SOCKET_MESSAGE, GameMessage } from "@socialgorithm/model";
import PubSub from "../../../../pub-sub/PubSub";

export type GameRunnerOptions = {
  gameServerAddress: string,
};

export class GameRunner {
  private gameSocket: SocketIOClient.Socket;
  private pubSub: PubSub;

  constructor(private matchID: string, private game: Game, private options: GameRunnerOptions) {
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
        this.create();
      });

      this.gameSocket.on(GAME_SOCKET_MESSAGE.GAME_CREATED, this.onCreate);
      this.gameSocket.on(GAME_SOCKET_MESSAGE.GAME_UPDATED, this.onUpdate);
      this.gameSocket.on(GAME_SOCKET_MESSAGE.GAME_ENDED, this.onFinish);

      this.gameSocket.on("disconnect", () => {
        debug("Connection to Game Server %s lost!", options.gameServerAddress);
      });
    } catch (e) {
      debug("sg: Unable to connect to Game Server. %O", e);
    }

    this.pubSub = new PubSub();
  }

  public close() {
    this.gameSocket.close();
  }

  /**
   * Play an individual game between two players
   */
  private create = () => {
    debug("Create game %O", this.game);
    this.gameSocket.emit(GAME_SOCKET_MESSAGE.CREATE_GAME, {
      gameID: this.game.gameID,
      players: this.game.players,
    });
  }

  private onCreate = (message: GameMessage.GameCreatedMessage) => {
    debug("Game %s received game started message %O", this.game.gameID, message);
    for (const [player, gameToken] of Object.entries(message.playerGameTokens)) {
      this.pubSub.publish(
        EVENTS.SERVER_TO_PLAYER,
        { player,
          event: EVENTS.GAME_SERVER_HANDOFF,
          payload: {
            gameServerAddress: this.options.gameServerAddress,
            gameID: this.game.gameID,
            token: gameToken,
          },
        },
      );
    }
  }

  private onFinish = (message: GameMessage.GameEndedMessage) => {
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

  private onUpdate = (message: GameMessage.GameUpdatedMessage) => {
    this.game.stats = message.payload;
  }
}
