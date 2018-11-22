const { CLIParser } = require('./cli-parser');

const parser = new CLIParser(process.argv);

parser.getCommand().handle();
