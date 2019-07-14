/// <reference types="socket.io-client" />
import { IEvent } from "./Events";
import { IEventHandler } from "./Handlers";
export declare class SocketClient {
    socketIOSocket: SocketIOClient.Socket;
    constructor(address: string);
    emit(event: IEvent): void;
    addHandler(handler: IEventHandler): void;
}
