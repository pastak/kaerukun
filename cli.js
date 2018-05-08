#!/usr/bin/env node
'use strict';

const meow = require('meow');
const kaerukun = require('./libs/main');

const cli = meow(`
  Usage
    $ kaerukun

  Options
    --config -c   Config file path
    --silent      Silect output
    --no-warning  Ignore warning
`, {
    flags: {
      config: {
        type: 'string',
        alias: 'c'
      },
      silent: {
        type: 'boolean'
      },
      warning: {
        type: 'boolean',
        default: true
      }
    }
  });

kaerukun({config: cli.flags.config, silent: cli.flags.silent, warning: cli.flags.warning});
