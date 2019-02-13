#!/usr/bin/env node

const server = require('../dist/cli/index')["default"];
const options = require('../dist/cli/options')["default"]();

server(options);