const { Athlete } = require('../../../models/athlete');
const { NAOrDefault } = require('../../support/na-default');

class AthleteCsv {
  constructor(index, csvArray, previous) {
    this.index = index;
    this.start = previous || 0;
    this.end = 6;
    this.array = csvArray.slice(this.start, this.end);
    this.model = this.parseModel();
  }

  parseModel() {
    const [_, name, sex, yearOfBirth, height, weight] = this.array;

    return new Athlete(
      this.prepareName(name),
      sex,
      parseInt(yearOfBirth, 0),
      {
        height: this.prepareParam(height),
        weight: this.prepareParam(weight),
      },
      null,
    );
  }

  prepareParam(value) {
    const val = NAOrDefault(value, null);

    return val ? parseInt(val, 0) : null;
  }

  prepareName(name) {
    return this.removeDataInQuotes(this.removeDataInBrackets(name));
  }

  removeDataInQuotes(name) {
    return name.replace(/['"]+/g, '');
  }

  removeDataInBrackets(name) {
    return name.replace(/ *\([^)]*\) */g, '');
  }

  getLastColumnNumber() {
    return this.end;
  }
}

exports.AthletesCSV = AthleteCsv;
