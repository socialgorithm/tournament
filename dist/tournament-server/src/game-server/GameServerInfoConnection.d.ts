import { Messages, SocketClient } from "@socialgorithm/model";
export declare class GameServerInfoConnection {
    status: Messages.GameServerStatus;
    gameSocket: SocketClient;
    private pubSub;
    constructor(gameServerAddress: string);
    private publishStatus;
}
