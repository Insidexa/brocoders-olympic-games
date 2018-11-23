const { argumentOrExit } = require('../../../src/app/support/argument-or-exit.js');

describe('argumentOrExit', () => {
  it('should exit with return code 1', () => {
    // https://stackoverflow.com/questions/46148169/stubbing-process-exit-with-jest
    const realProcess = process;
    const exitMock = jest.fn();
    // We assign all properties of the "real process" to
    // our "mock" process, otherwise, if "myFunc" relied
    // on any of such properties (i.e `process.env.NODE_ENV`)
    // it would crash with an error like:
    // `TypeError: Cannot read property 'NODE_ENV' of undefined`.
    global.process = { ...realProcess, exit: exitMock };
    argumentOrExit(undefined);
    expect(exitMock).toHaveBeenCalledWith(1);
    global.process = realProcess;
  });
  it('argument with initialized value should return true', () => {
    expect(argumentOrExit('winter')).toBe(true);
  });
});
