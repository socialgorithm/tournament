/// <reference types="socket.io-client" />
import { GameMessage } from "@socialgorithm/model";
export declare type GameServerStatus = {
    address: string;
    healthy: boolean;
    info: GameMessage.GameInfoMessage;
};
export declare class GameServerInfoConnection {
    status: GameServerStatus;
    gameSocket: SocketIOClient.Socket;
    private pubSub;
    constructor(gameServerAddress: string);
    private publishStatus;
}
