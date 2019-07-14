import * as io from "socket.io-client";
import { EventName, IEvent } from "./Events";
import { IEventHandler } from "./Handlers";

export class SocketClient {
  public socketIOSocket: SocketIOClient.Socket;

  constructor(address: string) {
    this.socketIOSocket = io(address, {
      reconnection: true,
      timeout: 2000,
    });
  }

  public emit(event: IEvent) {
    this.socketIOSocket.emit(EventName[event.name], event.message);
  }

  public addHandler(handler: IEventHandler) {
    this.socketIOSocket.on(EventName[handler.eventName], handler.handler);
  }

}
