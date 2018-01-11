#!/usr/bin/env node
'use strict';

const meow = require('meow')
const kaerukun = require('./libs/main');

const cli = meow(`
  Usage
    $ kaerukun

  Options
    --config. -c Config file path
`, {
  flags: {
    config: {
      type: 'string',
      alias: 'c'
    }
  }
});

kaerukun({config: cli.flags.config})
