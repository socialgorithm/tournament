import TournamentServer from "../TournamentServer";
import { IOptions, toTournamentServerOptions } from "./options";

export default (options: IOptions): TournamentServer =>
  new TournamentServer(toTournamentServerOptions(options));