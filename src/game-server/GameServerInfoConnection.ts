// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:gameServerInfoConnection");

import * as io from "socket.io-client";

import { EventName, Messages } from "@socialgorithm/model";
import { Events } from "../pub-sub";
import PubSub from "../pub-sub/PubSub";

export class GameServerInfoConnection {
  public status: Messages.GameServerStatus;
  public gameSocket: SocketIOClient.Socket;
  private pubSub: PubSub;

  constructor(gameServerAddress: string) {
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

    debug(`Initialising game server info connection to ${gameServerAddress}`);

    this.gameSocket = io(gameServerAddress, {
      reconnection: true,
      timeout: 2000,
    });

    this.gameSocket.on("connect", () => {
      debug(`Connected to ${gameServerAddress}`);
      this.status.healthy = true;
      this.publishStatus();
    });

    this.gameSocket.on("connect_failed", () => {
      debug(`Connection to ${gameServerAddress} failed`);
      this.status.healthy = false;
      this.publishStatus();
    });

    this.gameSocket.on("error", () => {
      debug(`Connection to ${gameServerAddress} errored`);
      this.status.healthy = false;
      this.publishStatus();
    });

    this.gameSocket.on(EventName.GameInfo, (gameInfo: Messages.GameInfoMessage) => {
      this.status.info = gameInfo;
      this.publishStatus();
    });

    this.gameSocket.on("disconnect", () => {
      debug(`Connection to ${gameServerAddress} lost!`);
      this.status.healthy = false;
      this.publishStatus();
    });
  }

  private publishStatus() {
    this.pubSub.publish(Events.GameServerStatus, this.status);
  }
}
