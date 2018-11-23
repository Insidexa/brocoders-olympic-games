const { uniqueBy } = require('../../../src/app/support/unique-by');

test('uniqueBy', () => {
  expect(uniqueBy([1, 1, 2, 2, 3, 4, 5], value => value)).toEqual([1, 2, 3, 4, 5]);
});
