import * as io from "socket.io";
import { IEvent } from "./Events";
import { IEventHandler } from "./Handlers";
export declare class Socket {
    socket: io.Socket;
    constructor(socket: io.Socket);
    emit(event: IEvent): void;
    addHandler(handler: IEventHandler): void;
}
