const { CLIParser } = require('./cli-parser');
const { Output } = require('./output');

class ChartCLI {
  constructor(db) {
    this.db = db;
    this.output = new Output();

    this.initDBEvents();
  }

  run(argv) {
    const parser = new CLIParser(argv);

    try {
      const command = parser.getCommand(this.db);
      const results = command.handle();

      this.output.show(results, command.headerName);
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  }

  initDBEvents() {
    process.on('exit', () => this.db.close());
    process.on('SIGINT', () => this.db.close());
    process.on('SIGHUP', () => this.db.close());
    process.on('SIGTERM', () => this.db.close());
  }
}

exports.ChartCLI = ChartCLI;
