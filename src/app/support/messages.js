const { SEASONS, MEDALS } = require('./types');

function choice(type, props) {
  return `${type} [ ${props.join(', ')} ]`;
}

function validationMessage(choiceMsg) {
  return `Enter ${choiceMsg}`;
}

const SEASON_MSG = validationMessage(choice('season', SEASONS));
const MEDAL_MSG = validationMessage(choice('medal', MEDALS));

const NOC_MSG = `Enter NOC name`;

exports.validationMessage = validationMessage;
exports.choice = choice;
exports.SEASON_MSG = SEASON_MSG;
exports.MEDAL_MSG = MEDAL_MSG;
exports.NOC_MSG = NOC_MSG;
