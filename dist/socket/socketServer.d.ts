export declare class SocketServer {
    private port;
    private io;
    private pubSub;
    private playerSockets;
    constructor(port: number);
    start(): void;
    private addPlayerToNamespace;
    private sendMessageToNamespace;
    private sendMessageToPlayer;
    private onMessageFromSocket;
    private onPlayerDisconnect;
    private handler;
}
