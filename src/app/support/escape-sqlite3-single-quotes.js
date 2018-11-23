function escapeSQLite3SingleQuotes(str) {
  str = str.replace(/\\/g, '');
  if (str.indexOf('\'') !== -1) {
    str = str.replace(/'/g, `''`);
  }

  return str;
}

exports.escapeSQLite3SingleQuotes = escapeSQLite3SingleQuotes;
