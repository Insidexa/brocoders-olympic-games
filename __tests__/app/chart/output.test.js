const { Output } = require('../../../src/app/chart/output');

describe('Output', () => {
  it('should return correct count progress symbols', () => {
    const output = new Output();
    expect(output.calculateRatio(30)).toBe(40);
  });
});
