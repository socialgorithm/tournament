/// <reference types="socket.io-client" />
import { Messages } from "@socialgorithm/model";
export declare class GameServerInfoConnection {
    status: Messages.GameServerStatus;
    gameSocket: SocketIOClient.Socket;
    private pubSub;
    constructor(gameServerAddress: string);
    private publishStatus;
}
