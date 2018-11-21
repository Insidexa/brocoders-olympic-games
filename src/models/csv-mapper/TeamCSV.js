const { Team } = require('./../../models/Team');

class TeamCSV {
  constructor(csvArray, previous) {
    this.start = previous || 6;
    this.end = 8;
    this.array = csvArray.slice(this.start, this.end);
  }

  parseModel() {
    const [name, nocName] = this.array;

    return new Team(
      this.prepareName(name),
      nocName,
    );
  }

  prepareName(name) {
    return name.replace(/(-[0-9])/g, '');
  }

  getLastColumnNumber() {
    return this.end;
  }
}

exports.TeamCSV = TeamCSV;
