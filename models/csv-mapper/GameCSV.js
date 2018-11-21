const { Game } = require('./../../models/Game');

const TYPE_SEASON = {
	'Summer': 0,
	'Winter': 1
};

class GameCSV {
	constructor(array) {
		this.array = array;
	}

	parseModel() {
		const [ _, year, season, city ] = this.array;

		return new Game(
			parseInt(year),
			TYPE_SEASON[season],
			city
		);
	}
}

exports.GameCSV = GameCSV;
exports.TYPE_SEASON = TYPE_SEASON;