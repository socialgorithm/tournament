/// <reference types="socket.io-client" />
import { GameInfoMessage } from "@socialgorithm/game-server";
export declare class GameServerInfoConnection {
    healthy: boolean;
    gameSocket: SocketIOClient.Socket;
    gameInfo: GameInfoMessage;
    constructor(gameServerAddress: string);
}
