import * as io from "socket.io";
import { EventName, IEvent } from "./Events";
import { IEventHandler } from "./Handlers";

/**
 * Typesafe wrapper for sockets received on server-side
 */
export class Socket {
  constructor(public socket: io.Socket) {}

  public emit(event: IEvent) {
    this.socket.emit(EventName[event.name], event.message);
  }

  public addHandler(handler: IEventHandler) {
    this.socket.on(EventName[handler.eventName], handler.handler);
  }
}
