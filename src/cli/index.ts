import Server from "../server";
import { IOptions } from "./options";

export default (options: IOptions) => new Server(options);
