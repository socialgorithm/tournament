import getOptions, {DEFAULT_OPTIONS} from "./cli/options";
import TournamentServer from "./TournamentServer";

const server = new TournamentServer({
    ...DEFAULT_OPTIONS,
    ...getOptions()
});
