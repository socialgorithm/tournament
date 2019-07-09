import * as commandLineArgs from "command-line-args";
import * as getUsage from "command-line-usage";

// tslint:disable-next-line:no-var-requires
const info = require("../../package.json");

/**
 * Server Options
 * If launching from the terminal these options can be set as `--{option name}[ value]`
 */
export interface IOptions {
  game?: string[];
  port?: number;
  version?: boolean;
  help?: number;
}

export const DEFAULT_OPTIONS: IOptions = {
  game: ["http://localhost:5433"],
  port: parseInt(process.env.PORT, 10) || 3141,
};

const optionDefinitions = [
  {
    alias: "g",
    name: "game",
    description: `A game server to connect to, defaults to {underline ${DEFAULT_OPTIONS.game}}`,
    type: String,
    typeLabel: `{underline ${DEFAULT_OPTIONS.game}}`,
    multiple: true,
    defaultValue: DEFAULT_OPTIONS.game,
  },
  {
    alias: "p",
    defaultValue: DEFAULT_OPTIONS.port,
    description: `Port on which the server should be started, defaults to {underline ${DEFAULT_OPTIONS.port}}`,
    name: "port",
    type: Number,
    typeLabel: `{underline ${DEFAULT_OPTIONS.port}}`,
  },
  {
    alias: "v",
    description: "Display the server version",
    name: "version",
    type: Boolean,
  },
  {
    alias: "h",
    description: "Print this guide",
    name: "help",
    type: Boolean,
  },
];

const sections = [
  {
    header: `${info.name} v${info.version}`,
    content: info.description,
  },
  {
    header: "Options",
    optionList: optionDefinitions,
  },
  {
    header: "Synopsis",
    content: [
      `$ ${info.name} {bold --game} {underline http://localhost:5001} {bold --game} {underline http://localhost:5002}`,
      `$ ${info.name} {bold --port} {underline 5000}`,
      `$ ${info.name} {bold --help}`,
    ],
  },
];

// ------------------------------------------- //

/**
 * Parse the options from the command line and then return the options object
 * @returns {any}
 */
export default (): IOptions => {
  const options: any = commandLineArgs(optionDefinitions);

  Object.keys(options).map((key: string) => {
    if (options[key] === null) {
      options[key] = true;
    }
  });

  if (options.version) {
    // tslint:disable-next-line:no-console
    console.log(info.version);
    process.exit(0);
  }

  if (options.help) {
    // tslint:disable-next-line:no-console
    console.log(getUsage(sections));
    process.exit(0);
  }

  if (options.port) {
    options.port = parseInt(options.port, 10);
  }

  return options;
};

// ------------------------------------------- //
