# Tournament Server

[![npm version](https://badge.fury.io/js/%40socialgorithm%2Ftournament-server.svg)](https://badge.fury.io/js/%40socialgorithm%2Ftournament-server)

Game-agnostic tournament server

## Run

An online version of this server is always running at [server.socialgorithm.org](https://server.socialgorithm.org/), deployed using DigitalOcean.

To run locally:

```console
$ npx @socialgorithm/tournament-server -h

tournament-server v10.0.0

  Socialgorithm Tournament Server

Options

...
```

## Developer Guide

Clone the repo locally and run `npm install`. Once dependencies are installed you can run:

```
$ npm run start:dev
```

This will run the typescript compiler and start the server, restarting the server whenever a file changes.


## Debugging

The server uses the [`debug`](https://github.com/visionmedia/debug) library to aid debugging. Simply run:

```
DEBUG=sg:* npm run start:dev
```

This will enable verbose logging of Socialgorithm related messages (use `*` to log everything).
