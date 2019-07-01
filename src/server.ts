// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:tournament-server");

import { banner } from "./banner";
import { IOptions } from "./cli/options";
import { EVENTS } from "./Events";
import { GameServerInfoConnection } from "./game-server/GameServerInfoConnection";
import { LobbyManager } from "./lobby/LobbyManager";
import PubSub from "./PubSub";
import { SocketServer } from "./socket/SocketServer";

/**
 * Entrypoint for the SG Tournament Server
 * This will start the socket server and create some PubSub bindings
 */
export default class TournamentServer {
  private socketServer: SocketServer;
  private gameServers: GameServerInfoConnection[];
  private pubSub: PubSub;
  private LobbyManager: LobbyManager;

  constructor(options: IOptions) {
    console.log(banner);

    debug("Initialising PubSub system");
    this.pubSub = new PubSub();

    debug("Initialising game server connections");
    const gameServers = options.game.map(gameServerAddress => new GameServerInfoConnection(gameServerAddress));

    debug("Initialising socket");
    this.socketServer = new SocketServer(options.port, gameServers);
    this.socketServer.start();

    this.LobbyManager = new LobbyManager();
  }
}
