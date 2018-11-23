const { NA } = require('./../../models/Result');

function NAOrDefault(value, def) {
  return value === NA ? def : value;
}

exports.NAOrDefault = NAOrDefault;
