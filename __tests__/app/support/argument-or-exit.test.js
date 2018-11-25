const { argumentOrError } = require('../../../src/app/support/argument-or-exit.js');

describe('argumentOrError', () => {
  it('should exit with return code 1', () => {
    expect(argumentOrError).toThrow(Error);
  });
  it('argument with initialized value should return true', () => {
    expect(argumentOrError('winter')).toBeTruthy();
  });
});
