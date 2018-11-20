const sqlite3 = require('sqlite3').verbose();
const { CSVReader } = require('./csv.reader');
const { AthletesCSV } = require('./../../models/csv-mapper/AthletesCSV.js');

const db = new sqlite3.Database('./database/olympic_history.db', sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error(err.message);
	}
	console.log('Connected to the chinook database.');
});

function removeQuotesIfNeeded(str) {
	if (str[0] === "\"") {
		str = str.substr(1);
	}

	if (str[str.length - 1] === "\"") {
		str = str.substr(0, str.length - 1);
	}

	return str;
}

function removeQuotesFromCSVStringArray(array) {
	return array.map(item => removeQuotesIfNeeded(item));
}

function CSVStringtoArray(row) {
	return row.split(',');
}

const parser = new CSVReader('./database/seeding/athlete_events.csv');
parser.parse((row) => {
	const array = removeQuotesFromCSVStringArray(CSVStringtoArray(row));
	const athlete = new AthletesCSV( array ).parseModel();
	const
	process.exit(0)
});