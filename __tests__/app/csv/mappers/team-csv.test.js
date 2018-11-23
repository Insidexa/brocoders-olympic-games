const { AthletesCSV } = require('../../../../src/app/csv/mappers/athlete-csv');
const { NA } = require('../../../../src/models/result');

describe('AthletesCSV', () => {
  const exampleAthleteCSVArray = [
    1,
    `Pedros (del'Torro)`,
    'M',
    '1930',
    30,
    'NA',
  ];

  const athlete = new AthletesCSV(0, exampleAthleteCSVArray, 0);

  it('should remove single quotes from string', () => {
    expect(athlete.model.full_name).toBe('Pedros');
  });

  it('should parse year', () => {
    expect(athlete.model.year_of_birth).toBe(1930);
  });

  it(`should return null if one of the params ${NA}`, () => {
    expect(athlete.prepareParam(NA)).toBe(null);
  });

  it('should parsed height in params', () => {
    expect(athlete.model.params.height).toBe(30);
  });

  it(`should parsed weight in params with csv-value ${NA}`, () => {
    expect(athlete.model.params.weight).toBe(null);
  });
});
