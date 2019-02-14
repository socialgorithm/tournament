import { SocketServer } from "./socket/socketServer";
import { banner } from "./lib/banner";
import { IOptions } from "./cli/options";
import { LobbyRunner } from './lobby/LobbyRunner';
import { LobbyManager } from './lobby/LobbyManager';

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

    /**
     * Log a message to the console
     * @param message
     */
    private log(message: string): void {
        const time = (new Date()).toTimeString().substr(0, 5);
        // tslint:disable-next-line:no-console
        console.log(`[${time}]`, message);
    }
}