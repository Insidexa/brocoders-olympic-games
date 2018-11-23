const { NA } = require('../../models/result');

function NAOrDefault(value, def) {
  return value === NA ? def : value;
}

exports.NAOrDefault = NAOrDefault;
