import { IOptions } from "./cli/options";
import { banner } from "./lib/banner";
import { LobbyManager } from "./lobby/LobbyManager";
import { SocketServer } from "./socket/socketServer";

/**
 * Entrypoint for the SG Tournament Server
 * This will start the socket server and create some PubSub bindings
 */
export class Server {
    private socketServer: SocketServer;
    private LobbyManager: LobbyManager;

    constructor(options: IOptions) {
        this.socketServer = new SocketServer(options.port);
        this.LobbyManager = new LobbyManager();
        this.start();
    }

    public start() {
        console.log(banner);

        this.socketServer.start();
    }
}
