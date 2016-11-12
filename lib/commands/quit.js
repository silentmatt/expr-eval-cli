module.exports = {
  syntax: '\\quit, \\q',
  description: 'Quit',
  run: function (args, repl) {
    repl.stop();
  }
};
