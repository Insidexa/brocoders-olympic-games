const { TYPE_MEDAL } = require('../../models/Result');
const { TYPE_SEASON } = require('../../models/Game');
const { NA } = require('../../models/Result');

const SEASONS = Object.keys(TYPE_SEASON).map(season => season.toLowerCase());
const MEDALS = Object.keys(TYPE_MEDAL)
  .filter(medal => medal !== NA).map(medal => medal.toLowerCase());

function capitalizeProp(prop) {
  return `${prop.charAt(0).toUpperCase()}${prop.slice(1)}`;
}

function seasonToEnum(prop) {
  return TYPE_SEASON[capitalizeProp(prop)];
}

function medalToEnum(prop) {
  return TYPE_MEDAL[capitalizeProp(prop)];
}

function checkIsMedal(maybeMedal) {
  return MEDALS.includes(maybeMedal);
}

function checkIsSeason(maybeSeason) {
  return SEASONS.includes(maybeSeason);
}

exports.seasonToEnum = seasonToEnum;
exports.medalToEnum = medalToEnum;
exports.checkIsMedal = checkIsMedal;
exports.checkIsSeason = checkIsSeason;
exports.capitalizeProp = capitalizeProp;
exports.SEASONS = SEASONS;
exports.MEDALS = MEDALS;
