const { Sport } = require('../../../models/Sport');

class SportCsv {
  constructor(csvArray, previous) {
    this.start = previous || 12;
    this.end = 13;
    this.array = csvArray.slice(this.start, this.end);
    this.model = this.parseModel();
  }

  parseModel() {
    const [name] = this.array;

    return new Sport(
      name,
    );
  }

  getLastColumnNumber() {
    return this.end;
  }
}

exports.SportCSV = SportCsv;
