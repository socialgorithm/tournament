// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:tournament-server");

import { IOptions } from "./cli/options";
import { GameServerInfoConnection } from "./game-server/GameServerInfoConnection";
import { banner } from "./lib/banner";
import { LobbyManager } from "./lobby/LobbyManager";
import { SocketServer } from "./socket/socketServer";

/**
 * Entrypoint for the SG Tournament Server
 * This will start the socket server and create some PubSub bindings
 */
export default class TournamentServer {
  private socketServer: SocketServer;
  private gameServers: GameServerInfoConnection[];
  private LobbyManager: LobbyManager;

  constructor(options: IOptions) {
    console.log(banner);

    debug("Initialising socket");
    this.socketServer = new SocketServer(options.port);
    this.socketServer.start();

    debug("Initialising game server connections");
    this.gameServers = options.game.map(gameServerAddress => new GameServerInfoConnection(gameServerAddress));

    this.LobbyManager = new LobbyManager();
  }
}
