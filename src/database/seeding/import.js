const sqlite3 = require('sqlite3').verbose();
const { CSVReader } = require('./csv.reader');
const { AthletesCSV } = require('./../../models/csv-mapper/AthletesCSV.js');
const { TeamCSV } = require('./../../models/csv-mapper/TeamCSV.js');
const { GameCSV, TYPE_SEASON } = require('./../../models/csv-mapper/GameCSV.js');

const db = new sqlite3.Database('./database/olympic_history.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

const athletes = [];
const teams = [];
const games = [];
const parser = new CSVReader('./database/seeding/athlete_events.csv');

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

parser.parse((row) => {
  const array = CSVStringToArray(row);

  if (array) {
    const unquotedArray = removeQuotesFromCSVStringArray(array);

    const athleteCSV = new AthletesCSV(unquotedArray);
    const athlete = athleteCSV.parseModel();
    athletes.push(athlete);

    const teamCSV = new TeamCSV(unquotedArray, athleteCSV.getLastColumnNumber());
    const team = teamCSV.parseModel();
    teams.push(team);

    const gameCSV = new GameCSV(unquotedArray, teamCSV.getLastColumnNumber());
    const game = gameCSV.parseModel();
    const isNotOfficial = !(game.year === 1906 && game.season === TYPE_SEASON.Summer);
    if (isNotOfficial) {
      games.push(game);
    }
  }
});

const gamesWithMoreCities = [];
const uniqueTeams = uniqueBy(teams, team => team.noc_name);

// уникальные игры по значению каждой игры
const uniqueGames = uniqueBy(games, game => `${game.season}${game.year}`);

function getGameCities(originalGame) {
  const cities = [];

  for (let i = 0; i < games.length; i++) {
    const checkGame = originalGame.year === games[i].year
      && originalGame.season === games[i].season;
    if (checkGame) {
      cities.push(games[i].city);
    }
  }

  return cities;
}

uniqueGames.forEach((game) => {
  const cities = getGameCities(game);
  if (cities.length > 1) {
    game.changeCitiesMultiple(cities);
    gamesWithMoreCities.push(game);
  }
});

db.close();
