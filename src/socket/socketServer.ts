import * as fs from "fs";
import * as http from "http";
import * as io from "socket.io";
import PubSub from "../lib/PubSub";
import { EVENTS } from '../lib/events';
import { GameToPlayerMessage, NamespacedMessage } from "./messages";
import { Player } from "@socialgorithm/game-server/src/constants";

export class SocketServer {
    private io: SocketIO.Server;
    private pubSub: PubSub;
    private playerSockets: {
        [ key: string ]: SocketIO.Socket,
    } = {};

    constructor(private port: number) {
        this.pubSub = new PubSub();
    }

    public start() {
        const app = http.createServer(this.handler);
        this.io = io(app);
        app.listen(this.port);
        

        console.log('Socket Listening on port ' + this.port);

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

        this.io.on('connection', (socket: SocketIO.Socket) => {
            const token = socket.handshake.query.token;
            const player = token;

            if (this.playerSockets[player]) {
                // Token already in use
                console.warn('Player already connected', player);
                return false;
            }

            console.log('Connected ', player);
            
            // Store the socket
            this.playerSockets[token] = socket;

            // Forward the socket events to the PubSub system
            const listenToEvents = [
                EVENTS.LOBBY_CREATE,
                EVENTS.LOBBY_TOURNAMENT_START,
                EVENTS.LOBBY_TOURNAMENT_CONTINUE,
                EVENTS.LOBBY_JOIN,
                EVENTS.LOBBY_PLAYER_BAN,
                EVENTS.LOBBY_PLAYER_KICK,
            ];
            listenToEvents.forEach(event => {
                socket.on(event, this.onMessageFromSocket(player, event));
            });
            
            // Special events
            socket.on('game', (data: any) => this.pubSub.publish(EVENTS.PLAYER_TO_GAME, { player, data }));
            socket.on('disconnect', this.onPlayerDisconnect(player));

            // Senders
            this.pubSub.subscribe(EVENTS.SERVER_TO_PLAYER, this.sendMessageToPlayer);
            this.pubSub.subscribe(EVENTS.BROADCAST_NAMESPACED, this.sendMessageToNamespace);
            this.pubSub.subscribe(EVENTS.ADD_PLAYER_TO_NAMESPACE, this.addPlayerToNamespace);

            //this.publish(events.PLAYER_CONNECT, player);
        });
    }

    private addPlayerToNamespace = (data: any) => {
        if (!this.playerSockets[data.player]) {
            console.warn('Error adding player to namespace, player socket does not exist', data.player);
            return;
        }
        this.playerSockets[data.player].join(data.namespace);
    }

    private sendMessageToNamespace = (data: NamespacedMessage) => {
        this.io.in(data.namespace).emit(data.event, data.payload);
    }

    private sendMessageToPlayer = (data: GameToPlayerMessage) => {
        if (!this.playerSockets[data.player]) {
            console.warn('Error sending message to player, player socket does not exist', data.player);
            return;
        }
        this.playerSockets[data.player].emit(data.event, data.payload);
    }

    private onMessageFromSocket = (player: Player, type: string) => (data: any) => {
        // socket -> pubsub
        this.pubSub.publish(type, {
            player,
            payload: data,
        });
    }

    private onPlayerDisconnect = (player: Player) => () => {
        // Just remove the player from the list
        delete this.playerSockets[player];
    };

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