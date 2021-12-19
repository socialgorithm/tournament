// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require("debug")("sg:game-server-list-publisher");

import { Messages } from "@socialgorithm/model";
import { Events } from "../pub-sub";
import PubSub from "../pub-sub/PubSub";

interface IGameList { [s: string]: Messages.GameServerStatus; }

export class GameServerListPublisher {
  private pubSub = new PubSub();
  private gameList: IGameList = { };

  constructor() {
    this.pubSub.subscribe(Events.GameServerStatus, (status: Messages.GameServerStatus) => {
      debug("Received game server update %O", status);
      this.gameList[status.address.playerAccessibleAddress] = status;
      this.publishGameList();
    });
  }

  public publishGameList(): void {
    this.pubSub.publish(Events.GameList, Object.values(this.gameList));
  }
}
