#!/usr/bin/env node

const server = require('../cli/index')["default"];
const options = require('../cli/options')["default"]();

server(options); 