/// <reference types="socket.io-client" />
import { GameInfoMessage } from "@socialgorithm/game-server";
export declare type GameServerStatus = {
    address: string;
    healthy: boolean;
    info: GameInfoMessage;
};
export declare class GameServerInfoConnection {
    status: GameServerStatus;
    gameSocket: SocketIOClient.Socket;
    private pubSub;
    constructor(gameServerAddress: string);
    private publishStatus;
}
