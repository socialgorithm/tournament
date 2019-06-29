# Tournament Server

Game-agnostic tournament server

## Development

Clone the repo locally and run `npm install`. Once dependencies are installed you can run:

```
$ npm run start:dev
```

This will run the typescript compiler and start the server, restarting the server whenever a file changes.


## Debugging

The server uses the `debug` library to aid debugging. Simply run:

```
DEBUG=sg:* npm run start:dev
```

This will enable verbose logging of Socialgorithm related messages (use `*` to log everything).

## Deploy

You can directly deploy the server to Heroku for a quick start:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/socialgorithm/tournament-server/tree/master)

When deploying, choose any available App Name (or let Heroku decide for you), and click on Deploy. Once it's finished browse to `https://{app-name}.herokuapp.com` and you should see the server welcome message.

If you open our [web client](https://play.socialgorithm.org), you can then connect it to the server by clicking on "Connect" and entering `https://{app-name}.herokuapp.com` as the server host.

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

...
```
