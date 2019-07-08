// tslint:disable-next-line:no-var-requires
const debug = require("debug")("sg:socketServer");

import { Player } from "@socialgorithm/game-server";
import * as fs from "fs";
import * as http from "http";
import * as io from "socket.io";
import { EVENTS } from "../events/Events";
import { ADD_PLAYER_TO_NAMESPACE_MESSAGE, BROADCAST_NAMESPACED_MESSAGE, SERVER_TO_PLAYER_MESSAGE } from "../events/Messages";
import { GameServerInfoConnection, GameServerStatus } from "../game-server/GameServerInfoConnection";
import PubSub from "../pub-sub/PubSub";

export class SocketServer {
  private io: SocketIO.Server;
  private pubSub: PubSub;
  private playerSockets: {
    [key: string]: SocketIO.Socket,
  } = {};

  constructor(private port: number, private gameServers: GameServerInfoConnection[]) {
    this.pubSub = new PubSub();
  }

  public start() {
    const app = http.createServer(this.handler);
    this.io = io(app);
    app.listen(this.port);

    // tslint:disable-next-line:no-console
    console.log(`Socket Listening on port: ${this.port}`);
    debug("Socket Listening on port: %d", this.port);

    this.io.use((socket: SocketIO.Socket, next: any) => {
      const isClient = socket.request._query.client || false;
      if (isClient) {
        return next();
      }
      const { token } = socket.request._query;
      if (!token) {
        return next(new Error("Missing token"));
      }
      next();
    });

    this.io.on("connection", (socket: SocketIO.Socket) => {
      const token = socket.handshake.query.token;
      const player = token;

      if (this.playerSockets[player]) {
        // Token already in use
        debug("Player already connected %s", player);
        return false;
      }

      debug("Connected %s", player);

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
      socket.on("game", (data: any) => this.pubSub.publish(EVENTS.PLAYER_TO_GAME, { player, data }));
      socket.on("disconnect", this.onPlayerDisconnect(player));
    });

    // Senders
    this.pubSub.subscribe(EVENTS.SERVER_TO_PLAYER, this.sendMessageToPlayer);
    this.pubSub.subscribe(EVENTS.BROADCAST_NAMESPACED, this.sendMessageToNamespace);
    this.pubSub.subscribe(EVENTS.ADD_PLAYER_TO_NAMESPACE, this.addPlayerToNamespace);
    this.pubSub.subscribe(EVENTS.GAME_LIST, this.sendGameListToEveryone);
  }

  private addPlayerToNamespace = (data: ADD_PLAYER_TO_NAMESPACE_MESSAGE) => {
    if (!this.playerSockets[data.player]) {
      debug("Error adding player (%s) to namespace, player socket does not exist", data.player);
      return;
    }
    this.playerSockets[data.player].join(data.namespace);

    // Send Game List
    this.playerSockets[data.player].emit(EVENTS.GAME_LIST, this.gameServers.map(server => server.status));
  }

  private sendMessageToNamespace = (data: BROADCAST_NAMESPACED_MESSAGE) => {
    this.io.in(data.namespace).emit(data.event, data.payload);
  }

  private sendMessageToPlayer = (data: SERVER_TO_PLAYER_MESSAGE) => {
    const socket = this.playerSockets[data.player];

    if (!socket) {
      debug("Error sending message to player (%s), player socket does not exist", data.player);
      return;
    }
    socket.emit(data.event, data.payload);
  }

  private sendGameListToEveryone = (data: GameServerStatus[]) => {
    debug("Game server list updated, publishing update: %O", data);
    Object.values(this.playerSockets).forEach(socket => {
      socket.emit(EVENTS.GAME_LIST, data);
    });
  }

  /**
   * Generic event forwarder from the socket to the pubsub bus
   */
  private onMessageFromSocket = (player: Player, type: any) => (payload: any) => {
    // socket -> pubsub
    const data: any = {
      payload,
      player,
    };
    this.pubSub.publish(type, data);
  }

  private onPlayerDisconnect = (player: Player) => () => {
    debug("Removing player (%s) from server", player);
    delete this.playerSockets[player];
    this.pubSub.publish(EVENTS.PLAYER_DISCONNECTED, { player });
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
