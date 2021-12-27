#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const server = require('../cli/index')["default"];
const options = require('../cli/options')["default"]();

server(options); 