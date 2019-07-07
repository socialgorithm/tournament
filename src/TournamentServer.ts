// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:tournament-server");

import { IOptions } from "./cli/options";
import { GameServerInfoConnection } from "./game-server/GameServerInfoConnection";
import { GameServerListPublisher } from "./game-server/GameServerListPublisher";
import { LobbyManager } from "./lobby/LobbyManager";
import { SocketServer } from "./socket/SocketServer";

/**
 * Entrypoint for the SG Tournament Server
 * This will start the socket server and create some PubSub bindings
 */
export default class TournamentServer {
  private socketServer: SocketServer;
  private LobbyManager: LobbyManager;

  constructor(options: IOptions) {
    console.log(banner);

    debug("Initialising game server connections");
    const gameServers = options.game.map(gameServerAddress => new GameServerInfoConnection(gameServerAddress));
    const gameServerListPublisher = new GameServerListPublisher();

    debug("Initialising socket");
    this.socketServer = new SocketServer(options.port, gameServers);
    this.socketServer.start();

    this.LobbyManager = new LobbyManager();
  }
}

const banner = `
                _       _                  _ _   _
 ___  ___   ___(_) __ _| | __ _  ___  _ __(_) |_| |__  _ __ ___
/ __|/ _ \\ / __| |/ _\` | |/ _\` |/ _ \\| '__| | __| '_ \\| '_ \` _ \\
\\__ \\ (_) | (__| | (_| | | (_| | (_) | |  | | |_| | | | | | | | |
|___/\\___/ \\___|_|\\__,_|_|\\__, |\\___/|_|  |_|\\__|_| |_|_| |_| |_|
                           |___/
`;
