const { TopTeamsHandler } = require('../../../../src/app/chart/handlers/top-teams-handler');

describe('TopTeamsHandler', () => {
  it('should correct parse all arguments', () => {
    const handler = new TopTeamsHandler(null, ['summer', '2004', 'silver']);
    const { medal, season, year } = handler;
    expect({ medal, season, year }).toEqual({ medal: 2, season: 0, year: 2004 });
  });

  it('should correct parse with only season', () => {
    const handler = new TopTeamsHandler(null, ['summer']);
    const { medal, season, year } = handler;
    expect({ medal, season, year }).toEqual({ medal: null, season: 0, year: null });
  });

  it('should correct without year', () => {
    const handler = new TopTeamsHandler(null, ['summer', 'silver']);
    const { medal, season, year } = handler;
    expect({ medal, season, year }).toEqual({ medal: 2, season: 0, year: null });
  });

  it('should correct return average with check ceil', () => {
    const handler = new TopTeamsHandler(null, ['summer', 'silver']);
    expect(handler.getAverage([
      { countMedals: 2 },
      { countMedals: 4 },
      { countMedals: 2 },
    ])).toEqual(3);
  });

  it('should correct filter teams with medals more max', () => {
    const handler = new TopTeamsHandler(null, ['summer', 'silver']);
    expect(handler.filterByMaxAverage([
      { countMedals: 500 },
      { countMedals: 100 },
      { countMedals: 200 },
      { countMedals: 300 },
    ])).toHaveLength(2);
  });
});
