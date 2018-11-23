const { capitalizeProp } = require('../../../src/app/support/types');

test('capitalizeProp', () => {
  expect(capitalizeProp('test')).toBe('Test');
});
