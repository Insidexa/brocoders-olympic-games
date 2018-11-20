const fs = require('fs');

class CSVReader {
	constructor(path) {
		this.assertFileExists(path);

		this.path = path;
	}

	parse(onParseRowCallback) {
		const data = fs.readFileSync(this.path).toString();
		const lines = data.split('\n');
		lines.shift();

		lines.forEach(line => onParseRowCallback(line));
	}

	assertFileExists(path) {
		if (!fs.existsSync(path)) {
			throw new Error(`File ${path} not exists`);
		}
	}
}

exports.CSVReader = CSVReader;