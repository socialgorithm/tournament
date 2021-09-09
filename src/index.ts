import { toTournamentServerOptions } from "./cli";
import getOptions, {DEFAULT_OPTIONS} from "./cli/options";
import TournamentServer from "./TournamentServer";

const options = {
    ...DEFAULT_OPTIONS,
    ...getOptions(),
};

const server = new TournamentServer(toTournamentServerOptions(options));
