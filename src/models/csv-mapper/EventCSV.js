const { Event } = require('./../../models/Event');

class EventCSV {
  constructor(csvArray, previous) {
    this.start = previous || 13;
    this.end = 14;
    this.array = csvArray.slice(this.start, this.end);
  }

  parseModel() {
    const [name] = this.array;

    return new Event(
      name,
    );
  }

  getLastColumnNumber() {
    return this.end;
  }
}

exports.EventCSV = EventCSV;
