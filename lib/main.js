'use strict';

var Repl = require('./repl');
var argv = require('yargs')
  .strict()
  .usage('Usage: expr-eval [opts] [-e <expr>]* [<expr>]')
  .example('expr-eval', 'Start an interactive calculator')
  .example('expr-eval -e "sqrt 2"', 'Calculate the square root of 2')
  .example('expr-eval -i -e "4*atan(1)"', 'Calculate pi then start the interactive calculator')
  .option('i', {
    alias: 'interactive',
    describe: 'Force interactive mode',
    type: 'boolean'
  })
  .option('e', {
    alias: 'expression',
    describe: 'Evaluate an expression',
    type: 'string'
  })
  .option('color', {
    describe: 'Force color output',
    type: 'boolean'
  })
  .option('no-color', {
    describe: 'Disable color output',
    type: 'boolean'
  })
  .help('h')
  .alias('h', '?')
  .alias('h', 'help')
  .string('_')
  .argv;

var repl = new Repl();
repl.on('stop', function () {
  process.exit(0);
});

var autoInteractive = true;

if (argv.expression) {
  autoInteractive = false;
  asArray(argv.expression).forEach(function (expr) {
    repl.evalAndPrint(String(expr));
  });
}

if (argv._.length) {
  autoInteractive = false;
  repl.evalAndPrint(argv._.join(' '));
}

if (argv.interactive || autoInteractive) {
  repl.start();
} else {
  repl.stop();
}

function asArray(arg) {
  return Array.isArray(arg) ? arg : [ arg ];
}
