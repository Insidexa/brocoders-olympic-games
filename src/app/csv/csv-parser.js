const { CSVReader } = require('./csv-reader');
const { AthletesCSV } = require('./mappers/athlete-csv.js');
const { TeamCSV } = require('./mappers/team-csv.js');
const { TYPE_SEASON } = require('../../models/game.js');
const { GameCSV } = require('./mappers/game-csv.js');
const { SportCSV } = require('./mappers/sport-csv.js');
const { EventCSV } = require('./mappers/event-csv.js');
const { uniqueBy } = require('../support/unique-by');

class CSVParser {
  constructor(path) {
    this.parser = new CSVReader(path);
    this.csv = [];
    this.athletes = [];
    this.teams = [];
    this.games = [];
    this.sports = [];
    this.events = [];
  }

  parse() {
    const unfilteredGames = [];
    const allTeams = [];
    const allSports = [];
    const allEvents = [];

    this.parser.parse((row, index) => {
      const array = this.CSVStringToArray(row);

      if (array) {
        const unquotedArray = this.removeQuotesFromCSVStringArray(array);

        const athleteCSV = new AthletesCSV(index, unquotedArray);
        const teamCSV = new TeamCSV(unquotedArray, athleteCSV.getLastColumnNumber());
        const gameCSV = new GameCSV(unquotedArray, teamCSV.getLastColumnNumber());
        const sportCSV = new SportCSV(unquotedArray, gameCSV.getLastColumnNumber());
        const eventCSV = new EventCSV(unquotedArray, sportCSV.getLastColumnNumber());
        const isNotOfficial = !(gameCSV.model.year === 1906
          && gameCSV.model.season === TYPE_SEASON.Summer);
        if (isNotOfficial) {
          this.athletes.push(athleteCSV);
          unfilteredGames.push(gameCSV);
          this.csv.push(unquotedArray);
        }

        allTeams.push(teamCSV);
        allSports.push(sportCSV);
        allEvents.push(eventCSV);
      }
    });

    this.prepareData({
      allTeams,
      allSports,
      allEvents,
      unfilteredGames,
    });
  }

  prepareData({
    allTeams, allSports, allEvents, unfilteredGames,
  }) {
    this.teams = uniqueBy(allTeams, team => team.model.noc_name);
    this.events = uniqueBy(allEvents, event => event.model.name);
    this.sports = uniqueBy(allSports, sport => sport.model.name);
    this.games = this.filterGamesWithMoreCities(unfilteredGames);
  }

  removeQuotesFromCSVStringArray(array) {
    return array.map(item => this.removeQuotesIfNeeded(item));
  }

  removeQuotesIfNeeded(str) {
    if (str[0] === '"') {
      str = str.substr(1);
    }

    if (str[str.length - 1] === '"') {
      str = str.substr(0, str.length - 1);
    }

    return str;
  }

  CSVStringToArray(row) {
    return row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
  }

  getGameCities(originalGame, unfilteredGames) {
    const cities = [];

    for (let i = 0; i < unfilteredGames.length; i++) {
      const unfilteredGame = unfilteredGames[i].model;
      const checkGame = originalGame.year === unfilteredGame.year
        && originalGame.season === unfilteredGame.season;
      if (checkGame) {
        cities.push(unfilteredGame.city);
      }
    }

    return cities;
  }

  filterGamesWithMoreCities(unfilteredGames) {
    const games = [];
    const uniquesGames = uniqueBy(unfilteredGames, game => `${game.model.season}${game.model.year}`);
    uniquesGames.forEach((game) => {
      const cities = this.getGameCities(game.model, unfilteredGames);
      if (cities.length > 1) {
        game.model.changeCitiesMultiple(cities, unfilteredGames);
        games.push(game);
      }
    });

    return games;
  }
}

exports.CSVParser = CSVParser;
