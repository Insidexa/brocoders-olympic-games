const { CSVReader } = require('./csv.reader');
const { AthletesCSV } = require('./mappers/AthletesCSV.js');
const { TeamCSV } = require('./mappers/TeamCSV.js');
const { TYPE_SEASON } = require('../../models/Game.js');
const { GameCSV } = require('./mappers/GameCSV.js');
const { SportCSV } = require('./mappers/SportCSV.js');
const { EventCSV } = require('./mappers/EventCSV.js');

const csv = [];
const athletes = [];
const teams = [];
const games = [];
const sports = [];
const events = [];
const gamesWithMoreCities = [];
const parser = new CSVReader('./storage/athlete_events.csv');

function uniqueBy(arr, fn) {
  const uniqueKey = {};
  const uniques = [];

  arr.forEach((item) => {
    const value = fn(item);
    if (!uniqueKey[value]) {
      uniqueKey[value] = true;
      uniques.push(item);
    }
  });

  return uniques;
}

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
  return array.map(item => removeQuotesIfNeeded(item));
}

function CSVStringToArray(row) {
  return row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
}

parser.parse((row, index) => {
  const array = CSVStringToArray(row);

  if (array) {
    const unquotedArray = removeQuotesFromCSVStringArray(array);

    const athleteCSV = new AthletesCSV(index, unquotedArray);
    const teamCSV = new TeamCSV(unquotedArray, athleteCSV.getLastColumnNumber());
    const gameCSV = new GameCSV(unquotedArray, teamCSV.getLastColumnNumber());
    const sportCSV = new SportCSV(unquotedArray, gameCSV.getLastColumnNumber());
    const eventCSV = new EventCSV(unquotedArray, sportCSV.getLastColumnNumber());
    const isNotOfficial = !(gameCSV.model.year === 1906
      && gameCSV.model.season === TYPE_SEASON.Summer);
    if (isNotOfficial) {
      athletes.push(athleteCSV);
      games.push(gameCSV);
      csv.push(unquotedArray);
    }

    teams.push(teamCSV);
    sports.push(sportCSV);
    events.push(eventCSV);
  }
});

const uniqueTeams = uniqueBy(teams, team => team.model.noc_name);
const uniqueEvents = uniqueBy(events, event => event.model.name);
const uniqueSports = uniqueBy(sports, sport => sport.model.name);

// уникальные игры по значению каждой игры
const uniqueGames = uniqueBy(games, game => `${game.model.season}${game.model.year}`);

function getGameCities(originalGame) {
  const cities = [];

  for (let i = 0; i < games.length; i++) {
    const checkGame = originalGame.year === games[i].model.year
      && originalGame.season === games[i].model.season;
    if (checkGame) {
      cities.push(games[i].model.city);
    }
  }

  return cities;
}

uniqueGames.forEach((game) => {
  const cities = getGameCities(game.model);
  if (cities.length > 1) {
    game.model.changeCitiesMultiple(cities);
    gamesWithMoreCities.push(game);
  }
});

exports.athletes = athletes;
exports.teams = uniqueTeams;
exports.games = gamesWithMoreCities;
exports.sports = uniqueSports;
exports.events = uniqueEvents;
exports.csv = csv;
