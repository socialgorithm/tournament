// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:tournament-server");

import * as http from "http";
import { AddressInfo } from "net";
import { GameServerInfoConnection } from "./game-server/GameServerInfoConnection";
import { GameServerListPublisher } from "./game-server/GameServerListPublisher";
import HttpHandler from "./http/HttpHandler";
import { LobbyManager } from "./lobby/LobbyManager";
import { SocketServer } from "./socket/SocketServer";
import { ITournamentServerOptions } from "./TournamentServerOptions";

/**
 * Entrypoint for the SG Tournament Server
 * This will start the socket server and create some PubSub bindings
 */
export default class TournamentServer {
  private socketServer: SocketServer;
  private LobbyManager: LobbyManager;

  constructor(options: ITournamentServerOptions) {
    console.log(banner);

    debug("Initialising game server connections");
    const gameServers = options.games.map(gameServerAddress => {
      debug("Connecting to " + gameServerAddress.tournamentServerAccessibleAddress);
      return new GameServerInfoConnection(gameServerAddress);
    });
    const gameServerListPublisher = new GameServerListPublisher();

    debug("Initialising server");
    const server = http.createServer(HttpHandler);
    this.socketServer = new SocketServer(server, gameServers);
    this.socketServer.start();
    const listener = server.listen(options.port, () => {
      const address = (listener.address() as AddressInfo);
      // tslint:disable-next-line:no-console
      console.log(`Listening on port ${address.port}`);
      debug("Listening on port %d", address.port);
    });

    this.LobbyManager = new LobbyManager(options.fixedLobbyName);
  }
}

const banner = `
                _       _                  _ _   _
 ___  ___   ___(_) __ _| | __ _  ___  _ __(_) |_| |__  _ __ ___
/ __|/ _ \\ / __| |/ _\` | |/ _\` |/ _ \\| '__| | __| '_ \\| '_ \` _ \\
\\__ \\ (_) | (__| | (_| | | (_| | (_) | |  | | |_| | | | | | | | |
|___/\\___/ \\___|_|\\__,_|_|\\__, |\\___/|_|  |_|\\__|_| |_|_| |_| |_|
                           |___/
TOURNAMENT SERVER
`;
