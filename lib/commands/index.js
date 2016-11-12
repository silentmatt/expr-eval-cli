var chalk = require('chalk');

exports.var = require('./var');
exports.quit = exports.q = require('./quit');

exports.help = exports['?'] = {
  syntax: '\\help, \\?',
  description: 'Show this help screen',
  run: function () {
    console.log(chalk.bold('Commands:'));
    console.log('');
    console.log(chalk.bold(exports.help.syntax));
    console.log('    ' + exports.help.description);
    console.log(chalk.bold(exports.quit.syntax));
    console.log('    ' + exports.quit.description);
    console.log(chalk.bold(exports.var.syntax));
    console.log('    ' + exports.var.description);
    console.log('');
  }
};
