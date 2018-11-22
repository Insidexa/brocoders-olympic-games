const { MedalsHandler } = require('./handlers/medals.handler');
const { TopTeamsHandler } = require('./handlers/top-teams.handler');

const COMMAND_TYPES = {
  medals: MedalsHandler,
  'top-teams': TopTeamsHandler,
};

class CLIParser {
  constructor(processArguments) {
    this.arguments = processArguments.slice(2);
  }

  getDeclatedCommands() {
    return Object.keys(COMMAND_TYPES);
  }

  getCommand(db) {
    const [commandName, ...argv] = this.arguments;
    if (!COMMAND_TYPES[commandName]) {
      console.log(`Command '${commandName}' not found.
Only declared: ${this.getDeclatedCommands().join(', ')}`);

      process.exit(1);
    }
    const commandInstance = new COMMAND_TYPES[commandName](db, argv);
    return commandInstance;
  }
}

exports.CLIParser = CLIParser;
