const { Team } = require('./../../models/Team');

class TeamCSV {
	constructor(array) {
		this.array = array;
	}

	parseModel() {
		const [ name, nocName ] = this.array;

		return new Team(
			this.prepareName(name),
			nocName
		);
	}

	prepareName(name) {
		return name.replace(/(-[0-9])/g, '');
	}
}

exports.TeamCSV = TeamCSV;