const sqlite3 = require('better-sqlite3');
const { CSVParser } = require('../../app/csv/csv-parser');
const { TYPE_SEASON } = require('../../app/csv/mappers/game-csv.js');
const { TYPE_MEDAL } = require('../../models/result.js');

Object.prototype.remap = function () {
  return JSON.parse(JSON.stringify(this));
};

function insertTeams(db, teams) {
  const insert = db.prepare('INSERT INTO Teams(`name`, noc_name) VALUES (@name, @noc_name)');

  const insertMany = db.transaction((teams) => {
    for (const team of teams) {
      insert.run(team);
    }
  });

  insertMany(teams.map(team => team.model.remap()));
}

function insertGames(db, games) {
  const insert = db.prepare('INSERT INTO Games(year, season, city) VALUES (@year, @season, @city)');

  const insertMany = db.transaction((games) => {
    for (const game of games) {
      insert.run(game);
    }
  });

  insertMany(games.map(game => game.model.remap()));
}

function insertEvents(db, events) {
  const insert = db.prepare('INSERT INTO Events(name) VALUES (@name)');

  const insertMany = db.transaction((events) => {
    for (const event of events) {
      insert.run(event);
    }
  });

  insertMany(events.map(event => event.model.remap()));
}

function insertSports(db, sports) {
  const insert = db.prepare('INSERT INTO Sports(name) VALUES (@name)');

  const insertMany = db.transaction((sports) => {
    for (const sport of sports) {
      insert.run(sport);
    }
  });

  insertMany(sports.map(sport => sport.model.remap()));
}

function escapeQuotes(str) {
  str = str.replace(/\\/g, '');
  if (str.indexOf('\'') !== -1) {
    str = str.replace(/'/g, `''`);
  }

  return str;
}

function prepareResult(db, row) {
  const [seasonName, cityName, sportName, eventName, medalName] = row.slice(10, 15);
  const medal = TYPE_MEDAL[medalName];
  const eventId = db.prepare(`SELECT id FROM Events WHERE \`name\` = '${escapeQuotes(eventName)}'`).get().id;
  const sportId = db.prepare('SELECT id FROM Sports WHERE `name` = ?').get(sportName).id;
  const city = escapeQuotes(cityName);

  const gameId = db
    .prepare(`SELECT id FROM Games WHERE year = ? AND season = ? AND city LIKE '%${city}%'`)
    .get(row[9], TYPE_SEASON[seasonName]).id;

  return {
    medal,
    game_id: gameId,
    event_id: eventId,
    sport_id: sportId,
  };
}

function insertResults(db, results) {
  const insert = db.prepare(`
INSERT INTO Results(athlete_id, game_id, sport_id, event_id, medal)
VALUES (@athlete_id, @game_id, @sport_id, @event_id, @medal)
`);

  const insertMany = db.transaction((results) => {
    for (const result of results) {
      insert.run(result);
    }
  });

  insertMany(results);
}

function insertAthletes(db, athletes, csv) {
  const preparedResults = [];
  const insert = db.prepare(`
INSERT INTO Athletes(full_name, sex, year_of_birth, params, team_id)
VALUES (@full_name, @sex, @year_of_birth, @params, @team_id)
`);

  const insertMany = db.transaction((athletes) => {
    for (const athlete of athletes) {
      const row = csv[athlete.index];
      if (row) {
        const result = prepareResult(db, row);
        const team = db.prepare('SELECT id FROM Teams WHERE noc_name = ?').get(row[7]);
        const ath = athlete.model;
        ath.team_id = team.id;
        ath.stringifyParams();

        const info = insert.run(ath.remap());
        result.athlete_id = info.lastInsertRowid;
        preparedResults.push(result);
      }
    }
  });

  insertMany(athletes);

  return preparedResults;
}

function importFromCSV() {
  const db = sqlite3('./storage/olympic_history.db');
  const parser = new CSVParser('./storage/athlete_events.csv');

  parser.parse();

  insertTeams(db, parser.teams);
  insertEvents(db, parser.events);
  insertSports(db, parser.sports);
  insertGames(db, parser.games);
  const results = insertAthletes(db, parser.athletes, parser.csv);
  insertResults(db, results);

  process.on('exit', () => db.close());
  process.on('SIGINT', () => db.close());
  process.on('SIGHUP', () => db.close());
  process.on('SIGTERM', () => db.close());
}

exports.importFromCSV = importFromCSV;
