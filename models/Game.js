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