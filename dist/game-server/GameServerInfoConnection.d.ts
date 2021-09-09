import { Socket } from "socket.io-client";
import { GameServerAddress, Messages } from "@socialgorithm/model";
export declare class GameServerInfoConnection {
    status: Messages.GameServerStatus;
    gameSocket: Socket;
    private pubSub;
    constructor(gameServerAddress: GameServerAddress);
    private publishStatus;
}
