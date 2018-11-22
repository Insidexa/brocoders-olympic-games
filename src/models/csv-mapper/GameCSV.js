const { Game, TYPE_SEASON } = require('./../../models/Game');

class GameCSV {
  constructor(csvArray, previous) {
    this.start = previous || 8;
    this.end = 12;
    this.array = csvArray.slice(this.start, this.end);
    this.model = this.parseModel();
  }

  parseModel() {
    const [_, year, season, city] = this.array;

    return new Game(
      parseInt(year, 0),
      TYPE_SEASON[season],
      city,
    );
  }

  getLastColumnNumber() {
    return this.end;
  }
}

exports.GameCSV = GameCSV;
