import { toTournamentServerOptions } from "./cli";
import getOptions, {DEFAULT_OPTIONS} from "./cli/options";
import TournamentServer from "./TournamentServer";

const options = {
    ...DEFAULT_OPTIONS,
    ...getOptions(),
};

new TournamentServer(toTournamentServerOptions(options));
