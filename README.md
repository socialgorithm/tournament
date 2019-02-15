# Tournament Server

Game-agnostic tournament server

## Development

Clone the repo locally and run `yarn`. Once dependencies are installed you can run:

```
$ yarn start:dev
```

This will run the typescript compiler and start the server, restarting the server whenever a file changes.

## Deploy

You can directly deploy the server to Heroku for a quick start:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/socialgorithm/tournament-server/tree/master)

When deploying, choose any available App Name (or let Heroku decide for you), and click on Deploy. Once it's finished browse to `https://{app-name}.herokuapp.com` and you should see the server welcome message.

If you open our [web client](https://uttt.socialgorithm.org), you can then connect it to the server by clicking on "Connect" and entering `https://{app-name}.herokuapp.com` as the server host.

## Run locally

Install using npm/yarn:

```console
$ npm install @socialgorithm/tournament-server
```

Then you can execute by running `tournament-server`:

```console
$ tournament-server -h
tournament-server v1.0.0

  Socialgorithm Tournament Server

Options

  --verbose         The input to process.
  -v, --version     Display the server version
  -p, --port 3141   Port on which the server should be started (defaults to 3141)
  -h, --help        Print this guide

Synopsis

  $ tournament-server --games 100
  $ tournament-server --port 5000
  $ tournament-server --help
```