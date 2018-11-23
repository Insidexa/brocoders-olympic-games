const TYPE_SEASON = {
  Summer: 0,
  Winter: 1,
};

class Game {
  constructor(year, season, city) {
    this.year = year;
    this.season = season;
    this.city = city;
  }

  changeCitiesMultiple(cities) {
    this.city = cities.join(',');
  }
}

exports.Game = Game;
exports.TYPE_SEASON = TYPE_SEASON;
