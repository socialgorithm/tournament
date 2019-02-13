export declare class SocketServer {
    private port;
    private io;
    constructor(port: number);
    start(): void;
    private onSocketMessage;
    private onPubSubMessage;
    private handler;
}
