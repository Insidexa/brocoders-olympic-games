const { Athletes } = require('./../../models/Athlete');

class AthletesCSV {
	constructor(array) {
		this.array = array;
	}

	parseModel() {
		const [ _, name, sex, yearOfBirth, height, weight, teamId ] = this.array;

		return new Athletes(
			this.prepareName(name),
			sex,
			parseInt(yearOfBirth),
			{
				height: this.prepareParam(height),
				weight: this.prepareParam(weight),
			},
			teamId
		);
	}

	prepareParam(value) {
		const val = NAOrDefault(value, null);

		return val ? parseInt(val) : null;
	}

	prepareName(name) {
		return this.removeDataInQuotes( this.removeDataInBrackets(name) )
	}

	removeDataInQuotes(name) {
		return name.replace(/['"]+/g, '');
	}

	removeDataInBrackets(name) {
		return name.replace(/ *\([^)]*\) */g, "");
	}
}

exports.AthletesCSV = AthletesCSV;