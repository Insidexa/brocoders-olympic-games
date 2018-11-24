const { CSVReader } = require('../../../src/app/csv/csv-reader');

describe('CSVReader', () => {
  const csvReader = new CSVReader('__tests__/app/csv/example.csv');
  const mockCallback = jest.fn(line => line);
  const line = `"1","A Dijiang","M",24,180,80,"China","CHN","1992 Summer",1992,"Summer","Barcelona","Basketball","Basketball Men's Basketball",NA`;

  it('should call callback on every line', () => {
    csvReader.parse(mockCallback);

    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('should return 1 row without header', () => {
    csvReader.parse(mockCallback);

    expect(mockCallback.mock.calls[0][0]).toBe(line);
  });
});
