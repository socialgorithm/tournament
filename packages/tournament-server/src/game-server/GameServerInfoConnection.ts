// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("sg:gameServerInfoConnection");

import { io, Socket } from "socket.io-client";

import { EventName, GameServerAddress, Messages } from "@socialgorithm/model";
import { Events } from "../pub-sub";
import PubSub from "../pub-sub/PubSub";

export class GameServerInfoConnection {
  public status: Messages.GameServerStatus;
  public gameSocket: Socket;
  private pubSub: PubSub;

  constructor(gameServerAddress: GameServerAddress) {
    debug(`Publishing preliminary status for ${gameServerAddress}`);
    this.pubSub = new PubSub();
    this.status = {
      address: gameServerAddress,
      healthy: false,
      info: {
        name: "Unable to Connect",
      },
    };
    this.publishStatus();

    // We use the tournament server accessible address (and not the one sent to players)
    const gameServerConnectAddress = gameServerAddress.tournamentServerAccessibleAddress;

    debug(`Initialising game server info connection to ${gameServerConnectAddress}`);

    this.gameSocket = io(gameServerConnectAddress, {
      reconnection: true,
      timeout: 2000,
    });

    this.gameSocket.on("connect", () => {
      debug(`Connected to ${gameServerConnectAddress}`);
      this.status.healthy = true;
      this.publishStatus();
    });

    this.gameSocket.on("connect_failed", () => {
      debug(`Connection to ${gameServerConnectAddress} failed`);
      this.status.healthy = false;
      this.publishStatus();
    });

    this.gameSocket.on("error", () => {
      debug(`Connection to ${gameServerConnectAddress} errored`);
      this.status.healthy = false;
      this.publishStatus();
    });

    this.gameSocket.on(EventName.GameInfo, (gameInfo: Messages.GameInfoMessage) => {
      this.status.info = gameInfo;
      this.publishStatus();
    });

    this.gameSocket.on("disconnect", () => {
      debug(`Connection to ${gameServerConnectAddress} lost!`);
      this.status.healthy = false;
      this.publishStatus();
    });
  }

  private publishStatus() {
    this.pubSub.publish(Events.GameServerStatus, this.status);
  }
}
