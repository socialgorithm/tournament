import { IOptions } from "./cli/options";
export declare class Server {
    private socketServer;
    constructor(options: IOptions);
    start(): void;
    private log;
}
