const { NAOrDefault } = require('../../../src/app/support/na-default');
const { NA } = require('../../../src/models/result');

describe('NAOrDefault', () => {
  it(`should return null with ${NA}`, () => {
    expect(NAOrDefault(NA, null)).toBe(null);
  });
  it(`should return value if not ${NA}`, () => {
    const someValue = 'some value';
    expect(NAOrDefault(someValue, null)).toBe(someValue);
  });
});
