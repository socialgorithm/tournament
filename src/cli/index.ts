import { IOptions } from "./options";
import { Server } from "../server";

export default (options: IOptions) => new Server(options);