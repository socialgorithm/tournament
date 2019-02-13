import { SocketServer } from "./socket/socketServer";
import { banner } from "./banner";

/**
 * Entrypoint for the SG Tournament Server
 * This will start the socket server and create some PubSub bindings
 */
export class Server {
    private socketServer: SocketServer;

    constructor() {
        // Initiate the Socket
        this.socketServer = new SocketServer();
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