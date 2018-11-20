const sqlite3 = require('sqlite3').verbose();
const { CSVReader } = require('./csv.reader');
const { AthletesCSV } = require('./../../models/csv-mapper/AthletesCSV.js');
const { TeamCSV } = require('./../../models/csv-mapper/TeamCSV.js');

const db = new sqlite3.Database('./database/olympic_history.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the chinook database.');
});

function removeQuotesIfNeeded(str) {
	if (str[0] === '"') {
		str = str.substr(1);
	}

	if (str[str.length - 1] === '"') {
		str = str.substr(0, str.length - 1);
	}

	return str;
}

function removeQuotesFromCSVStringArray(array) {
	if (!array) {
		console.log(array)
	}
	return array.map(item => removeQuotesIfNeeded(item));
}

function CSVStringtoArray(row) {
	return row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
}

const athletes = [],
			teams = [],
			games = [];

const parser = new CSVReader('./database/seeding/athlete_events.csv');

parser.parse((row) => {
	const array = CSVStringtoArray(row);

	if (array) {
		const unquotedArray = removeQuotesFromCSVStringArray(array);

		athletes.push(
			new AthletesCSV( unquotedArray ).parseModel()
		);

		unquotedArray.splice(0, 6);

		teams.push(
			new TeamCSV(unquotedArray).parseModel()
		);

		array.splice(0, 2);



		// process.exit(0)
	}
});

const uniqueTeams = [...new Set(teams.map(item => item.noc_name))];
