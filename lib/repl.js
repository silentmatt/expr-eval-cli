'use strict';

var Parser = require('expr-eval').Parser;
var commands = require('./commands');
var chalk = require('chalk');
var readline = require('readline');
var EventEmitter = require('events');

function Repl() {
  var repl = this;
  EventEmitter.call(this);

  this.parser = new Parser();
  this.scope = {};
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: isTTY()
  });
  rl.pause();
  rl.setPrompt(isTTY() ? '> ' : '');
  rl.on('line', function (line) {
    line = line.trim();
    if (!line) {
      return;
    }

    if (/^\\/.test(line)) {
      repl.runCommand(line);
    } else {
      repl.evalAndPrint(line);
    }
  }).on('line', function () {
    rl.prompt();
  }).on('close', function () {
    repl.emit('stop');
  });

  this.rl = rl;
}

Repl.prototype = Object.create(EventEmitter.prototype);

Repl.prototype.start = function () {
  this.rl.resume();
  this.rl.prompt();
};

Repl.prototype.stop = function () {
  this.rl.close();
};

function isTTY() {
  return !!(process.stdout.isTTY && process.stdin.isTTY);
}

Repl.prototype.eval = function (expr) {
  var answer = this.parser.parse(expr).evaluate(this.scope);
  this.scope.last = answer;
  return answer;
};

Repl.prototype.print = function (result) {
  console.log(chalk.bold.green(result));
};

Repl.prototype.printError = function (result) {
  console.error(chalk.red(result));
};

Repl.prototype.evalAndPrint = function (expr) {
  try {
    var answer = this.eval(expr);
    this.print(answer);
    return answer;
  } catch (e) {
    this.printError(e.message);
  }
};

Repl.prototype.setVariable = function (variable, value) {
  this.scope[variable] = value;
};

Repl.prototype.runCommand = function (line) {
  var parts = /^\\(\S+)\s*(.*)$/.exec(line);
  if (parts) {
    var command = parts[1];
    var args = parts[2];

    if (commands[command]) {
      commands[command].run(args, this);
    } else {
      this.printError('Unknown command: ' + line);
      this.printError('Try \\? for the list of available commands');
    }
  } else {
    this.printError('Invalid command syntax: ' + line);
    this.printError('Try \\? for the list of available commands');
  }
};

module.exports = Repl;
