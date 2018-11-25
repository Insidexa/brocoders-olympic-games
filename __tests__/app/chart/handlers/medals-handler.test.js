const { MedalsHandler } = require('../../../../src/app/chart/handlers/medals-handler');

describe('MedalsHandler', () => {
  it('should correct parse all arguments', () => {
    const handler = new MedalsHandler(null, ['winter', 'ukr', 'gold']);
    const { medal, season, noc } = handler;
    expect({ medal, season, noc }).toEqual({ medal: 1, season: 1, noc: 'UKR' });
  });

  it('should correct parse inverted season and medal', () => {
    const handler = new MedalsHandler(null, ['gold', 'ukr', 'winter']);
    const { medal, season, noc } = handler;
    expect({ medal, season, noc }).toEqual({ medal: 1, season: 1, noc: 'UKR' });
  });

  it('should correct parse without medal', () => {
    const handler = new MedalsHandler(null, ['winter', 'ukr']);
    const { medal, season, noc } = handler;
    expect({ medal, season, noc }).toEqual({ medal: null, season: 1, noc: 'UKR' });
  });
});
