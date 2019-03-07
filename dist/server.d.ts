import { IOptions } from "./cli/options";
export declare class Server {
    private socketServer;
    private LobbyManager;
    constructor(options: IOptions);
    start(): void;
}
