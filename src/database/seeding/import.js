const sqlite3 = require('better-sqlite3');
const {
  athletes, teams, games, sports, events, csv,
} = require('./parsing');
const { TYPE_SEASON } = require('./../../models/csv-mapper/GameCSV.js');
const { TYPE_MEDAL } = require('./../../models/Result.js');

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
  const medal = TYPE_MEDAL[row[14]];
  const eventId = db.prepare(`SELECT id FROM Events WHERE \`name\` = '${escapeQuotes(row[13])}'`).get().id;
  const sportId = db.prepare('SELECT id FROM Sports WHERE `name` = ?').get(row[12]).id;
  const city = escapeQuotes(row[11]);

  const game = db.prepare(`SELECT id FROM Games WHERE year = ? AND season = ? AND city LIKE '%${city}%'`)
    .get(row[9], TYPE_SEASON[row[10]]);

  return {
    medal,
    game_id: game.id,
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

function insertAthletes(db, athletes) {
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
  insertTeams(db, teams);
  insertEvents(db, events);
  insertSports(db, sports);
  insertGames(db, games);
  const results = insertAthletes(db, athletes);
  insertResults(db, results);

  process.on('exit', () => db.close());
  process.on('SIGINT', () => db.close());
  process.on('SIGHUP', () => db.close());
  process.on('SIGTERM', () => db.close());
}

exports.importFromCSV = importFromCSV;
