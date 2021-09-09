import TournamentServer from "../TournamentServer";
import { ITournamentServerOptions } from "../TournamentServerOptions";
import { IOptions } from "./options";

export default (options: IOptions) => new TournamentServer(toTournamentServerOptions(options));

export function toTournamentServerOptions(options: IOptions): ITournamentServerOptions {
    return  {
        games: options.game.map(game => {
            const [tournamentServerAccessibleAddress, playerAccessibleAddress] = game.split(",");
            return { tournamentServerAccessibleAddress, playerAccessibleAddress };
        }),
        port: options.port,
    };
}
