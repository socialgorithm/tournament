// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:gameServerInfoConnection");

import * as io from "socket.io-client";

import { GAME_SOCKET_MESSAGE, GameInfoMessage } from "@socialgorithm/game-server";

export class GameServerInfoConnection {
  public healthy: boolean = false;
  public gameSocket: SocketIOClient.Socket;
  public gameInfo: GameInfoMessage;

  constructor(gameServerAddress: string) {
    debug("Initialising game server info connection to %s", gameServerAddress);

    this.gameSocket = io(gameServerAddress, {
        reconnection: true,
        timeout: 2000,
    });

    this.gameSocket.on("connect", () => {
        debug(`Connected to Game Server`);
    });

    this.gameSocket.on(GAME_SOCKET_MESSAGE.GAME_INFO, (gameInfo: GameInfoMessage) => {
        this.gameInfo = gameInfo;
        this.healthy = true;
    });

    this.gameSocket.on("disconnect", () => {
        debug("Connection to Game Server %s lost!", gameServerAddress);
        this.healthy = false;
    });
  }
}
