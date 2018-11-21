const { Game } = require('./../../models/Game');

const TYPE_SEASON = {
	'Summer': 0,
	'Winter': 1
};

class GameCSV {
	constructor(csvArray, previous) {
		this.start = previous || 8;
		this.end = 12;
		this.array = csvArray.slice(this.start, this.end);
	}

	parseModel() {
		const [ _, year, season, city ] = this.array;

		return new Game(
			parseInt(year),
			TYPE_SEASON[season],
			city
		);
	}

	getLastColumnNumber() {
		return this.end;
	}
}

exports.GameCSV = GameCSV;
exports.TYPE_SEASON = TYPE_SEASON;