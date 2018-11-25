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
      throw new Error(`Enter command. ${this.commandDeclarations()}`);
    }

    if (!COMMAND_TYPES[commandName]) {
      throw new Error(`Command '${commandName}' not found. ${this.commandDeclarations()}`);
    }
    const commandInstance = new COMMAND_TYPES[commandName](db, argv);
    return commandInstance;
  }
}

exports.CLIParser = CLIParser;
