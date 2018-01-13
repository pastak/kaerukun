#!/usr/bin/env node
'use strict';

const meow = require('meow');
const kaerukun = require('./libs/main');

const cli = meow(`
  Usage
    $ kaerukun

  Options
    --config -c Config file path
    --silent    Silect output
`, {
    flags: {
      config: {
        type: 'string',
        alias: 'c'
      },
      silent: {
        type: 'boolean'
      }
    }
  });

kaerukun({config: cli.flags.config, silent: cli.flags.silent});
