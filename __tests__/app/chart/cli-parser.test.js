const { CLIParser } = require('../../../src/app/chart/cli-parser');

describe('CLIParser', () => {
  it('should throw error if command not found', () => {
    const cliParser = new CLIParser(['some-command']);
    expect(cliParser.getCommand).toThrow(Error);
  });

  it('should detect handler instance', () => {
    const cliParser = new CLIParser([null, null, 'medals', 'winter', 'ukr']);
    expect(cliParser.getCommand({})).toHaveProperty('headerName');
  });
});
