import * as fs from "fs";
import * as http from "http";
import * as io from "socket.io";

export class SocketServer {
    private io: SocketIO.Server;

    public start() {
        const port = 3333;
        const app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(port);

        this.io.use((socket: SocketIO.Socket, next: any) => {
            const isClient = socket.request._query.client || false;
            if (isClient) {
                return next();
            }
            const { token } = socket.request._query;
            if (!token) {
                return next(new Error("Missing token"));
            }
            socket.request.testToken = token;
            next();
        });
    }

    private onSocketMessage() {
        // socket -> pubsub
    }

    private onPubSubMessage() {
        // pubsub -> socket
    }

    /**
     * Handler for the WebSocket server. It returns a static HTML file for any request
     * that links to the server documentation and Github page.
     * @param req
     * @param res
     */
    private handler(req: http.IncomingMessage, res: http.ServerResponse) {
        fs.readFile(__dirname + "/../../public/index.html",
            (err: any, data: any) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading index.html");
                }

                res.writeHead(200);
                res.end(data);
            });
    }
}