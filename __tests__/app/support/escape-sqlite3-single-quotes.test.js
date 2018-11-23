const { escapeSQLite3SingleQuotes } = require('../../../src/app/support/escape-sqlite3-single-quotes');

describe('escapeSQLite3SingleQuotes sqlite3', () => {
  it('should return double single quotes ', () => {
    expect(escapeSQLite3SingleQuotes(`Cross Country Skiing Men's 4 x 10 kilometres Relay`))
      .toBe(`Cross Country Skiing Men''s 4 x 10 kilometres Relay`);
  });

  it('should return double single quotes when receive escaped single quote', () => {
    expect(escapeSQLite3SingleQuotes(`Cross Country Skiing Men\'s 4 x 10 kilometres Relay`))
      .toBe(`Cross Country Skiing Men''s 4 x 10 kilometres Relay`);
  });
});
