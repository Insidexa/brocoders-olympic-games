const { CSVParser } = require('../../../src/app/csv/csv-parser');

describe('CSVParser', () => {
  const csvParser = new CSVParser('__tests__/app/csv/game-cities.csv');
  csvParser.parse();

  it('should correct parse csv row with separator in column string', () => {
    const stringWithDotInQuotes = `1, "Pedro's", 2, NA, "1, 2, 3", "a, b"`;
    const csvArr = csvParser.CSVStringToArray(stringWithDotInQuotes);
    expect(csvArr).toEqual([
      "1",
      `"Pedro's"`,
      '2',
      'NA',
      `"1, 2, 3"`,
      `"a, b"`,
    ]);
  });

  it('should remove double quotes', () => {
    expect(csvParser.removeQuotesIfNeeded(`"Pedro's"`)).toBe(`Pedro's`);
  });

  it('should return correct length for generated data', () => {
    const {
      games, events, sports, athletes, teams,
    } = csvParser;
    expect(games.length).toBe(2);
    expect(events.length).toBe(2);
    expect(sports.length).toBe(2);
    expect(athletes.length).toBe(4);
    expect(teams.length).toBe(2);
  });

  it('should find cities for games', () => {
    const { games } = csvParser;
    expect(games[0].model.city).toBe('Odessa,Sumy');
    expect(games[1].model.city).toBe('Chernigov,Kiev');
  });
});
