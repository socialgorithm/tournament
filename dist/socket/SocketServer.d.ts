/// <reference types="node" />
import * as http from "http";
import { GameServerInfoConnection } from "../game-server/GameServerInfoConnection";
export declare class SocketServer {
    private server;
    private gameServers;
    private io;
    private pubSub;
    private playerSockets;
    constructor(server: http.Server, gameServers: GameServerInfoConnection[]);
    start(): void;
    private addPlayerToNamespace;
    private sendMessageToNamespace;
    private sendMessageToPlayer;
    private sendGameListToEveryone;
    private onMessageFromSocket;
    private translateSocketMessageToPubSub;
    private onPlayerDisconnect;
    private handler;
}
