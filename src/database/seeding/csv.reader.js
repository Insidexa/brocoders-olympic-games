const fs = require('fs');

class CSVReader {
  constructor(path) {
    this.assertFileExists(path);

    this.path = path;
  }

  parse(onParseRowCallback) {
    const data = fs.readFileSync(this.path).toString();
    const lines = `
    "1","A Dijiang","M",24,180,80,"China","CHN","1992 Summer",1992,"Summer","Barcelona","Basketball","Basketball Men's Basketball",NA
"2","A Lamusi","M",23,170,60,"China","CHN","2012 Summer",2012,"Summer","London","Judo","Judo Men's Extra-Lightweight",NA

    `.split('\n');
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
