module.exports = {
  syntax: '\\var <name> = <expression>',
  description: 'Evaluate <expression> and assign the result to a variable <name>',
  run: function (args, repl) {
    var match = /([a-z][a-z0-9_]*)(?:\s*=)\s*(\S.*)$/i.exec(args);
    if (match) {
      repl.scope[match[1]] = repl.evalAndPrint(match[2]);
    } else {
      repl.printError('Usage: ' + this.syntax);
    }
  }
};
