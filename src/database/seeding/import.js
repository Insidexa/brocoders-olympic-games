const { escapeSQLite3SingleQuotes } = require('../../app/support/escape-sqlite3-single-quotes');
const { seasonToEnum, medalToEnum } = require('./../../app/support/types');

class CSVImporter {
  constructor(db, parser) {
    this.db = db;
    this.parser = parser;

    this.initDBEvents();
    this.parser.parse();
  }

  run() {
    this.insertTeams();
    this.insertEvents();
    this.insertSports();
    this.insertGames();
    const results = this.insertAthletes();
    this.insertResults(results);
  }

  insertTeams() {
    const insert = this.db.prepare('INSERT INTO Teams(`name`, noc_name) VALUES (@name, @noc_name)');

    const insertMany = this.db.transaction((teams) => {
      for (const team of teams) {
        insert.run(team);
      }
    });

    insertMany(this.parser.teams.map(team => this.remap(team.model)));
  }

  insertGames() {
    const insert = this.db.prepare('INSERT INTO Games(year, season, city) VALUES (@year, @season, @city)');

    const insertMany = this.db.transaction((games) => {
      for (const game of games) {
        insert.run(game);
      }
    });

    insertMany(this.parser.games.map(game => this.remap(game.model)));
  }

  insertEvents() {
    const insert = this.db.prepare('INSERT INTO Events(name) VALUES (@name)');

    const insertMany = this.db.transaction((events) => {
      for (const event of events) {
        insert.run(event);
      }
    });

    insertMany(this.parser.events.map(event => this.remap(event.model)));
  }

  insertSports() {
    const insert = this.db.prepare('INSERT INTO Sports(name) VALUES (@name)');

    const insertMany = this.db.transaction((sports) => {
      for (const sport of sports) {
        insert.run(sport);
      }
    });

    insertMany(this.parser.sports.map(sport => this.remap(sport.model)));
  }

  prepareResult(row) {
    const [seasonName, cityName, sportName, eventName, medalName] = row.slice(10, 15);
    const medal = medalToEnum(medalName);
    const event = escapeSQLite3SingleQuotes(eventName);
    const city = escapeSQLite3SingleQuotes(cityName);
    const eventId = this.db.prepare(`SELECT id FROM Events WHERE \`name\` = '${event}'`).get().id;
    const sportId = this.db.prepare('SELECT id FROM Sports WHERE `name` = ?').get(sportName).id;

    const gameId = this.db
      .prepare(`SELECT id FROM Games WHERE year = ? AND season = ? AND city LIKE '%${city}%'`)
      .get(row[9], seasonToEnum(seasonName)).id;

    return {
      medal,
      game_id: gameId,
      event_id: eventId,
      sport_id: sportId,
    };
  }

  insertResults(results) {
    const insert = this.db.prepare(`
INSERT INTO Results(athlete_id, game_id, sport_id, event_id, medal)
VALUES (@athlete_id, @game_id, @sport_id, @event_id, @medal)
`);

    const insertMany = this.db.transaction((results) => {
      for (const result of results) {
        insert.run(result);
      }
    });

    insertMany(results);
  }

  insertAthletes() {
    const preparedResults = [];
    const insert = this.db.prepare(`
INSERT INTO Athletes(full_name, sex, year_of_birth, params, team_id)
VALUES (@full_name, @sex, @year_of_birth, @params, @team_id)
`);

    const insertMany = this.db.transaction((athletes) => {
      for (const athlete of athletes) {
        const row = this.parser.csv[athlete.index];
        if (row) {
          const result = this.prepareResult(row);
          const team = this.db.prepare('SELECT id FROM Teams WHERE noc_name = ?').get(row[7]);
          const ath = athlete.model;
          ath.team_id = team.id;
          ath.stringifyParams();

          const info = insert.run(this.remap(ath));
          result.athlete_id = info.lastInsertRowid;
          preparedResults.push(result);
        }
      }
    });

    insertMany(this.parser.athletes);

    return preparedResults;
  }

  initDBEvents() {
    process.on('exit', () => this.db.close());
    process.on('SIGINT', () => this.db.close());
    process.on('SIGHUP', () => this.db.close());
    process.on('SIGTERM', () => this.db.close());
  }

  remap(object) {
    return JSON.parse(JSON.stringify(object));
  }
}

exports.CSVImporter = CSVImporter;
