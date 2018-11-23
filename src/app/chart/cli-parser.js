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

  commandDeclarations() {
    return `Only declared: [ ${this.getDeclatedCommands().join(' | ')} ]`;
  }

  getCommand(db) {
    const [commandName, ...argv] = this.arguments;

    if (!commandName) {
      console.log(`Enter command. ${this.commandDeclarations()}`);

      process.exit(1);
    }

    if (!COMMAND_TYPES[commandName]) {
      console.log(`Command '${commandName}' not found. ${this.commandDeclarations()}`);

      process.exit(1);
    }
    const commandInstance = new COMMAND_TYPES[commandName](db, argv);
    return commandInstance;
  }
}

exports.CLIParser = CLIParser;
