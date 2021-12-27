import parseCommandLineOptions, { DEFAULT_OPTIONS, toTournamentServerOptions } from "./cli/options";
import TournamentServer from "./TournamentServer";

const options = {
    ...DEFAULT_OPTIONS,
    ...parseCommandLineOptions(),
};

new TournamentServer(toTournamentServerOptions(options));
