const { argumentOrExit } = require('../../support/argument-or-exit');
const {
  checkIsMedal, checkIsSeason, medalToEnum, seasonToEnum,
} = require('../../support/types');
const { SEASON_MSG } = require('../../support/messages');

const MAX_MEDALS_AVERAGE = 200;

class TopTeamsHandler {
  constructor(db, argv) {
    this.headerName = 'NOC';
    this.db = db;
    this.medal = null;
    this.year = null;

    this.initParams(argv);
  }

  initParams(argv) {
    const season = argv.find(arg => checkIsSeason(arg));
    const medal = argv.find(arg => checkIsMedal(arg));
    const year = argv.find(arg => this.checkIsNumber(arg));
    if (!season) {
      argumentOrExit(undefined, SEASON_MSG);
    }
    this.season = seasonToEnum(season);

    if (year) {
      this.year = parseInt(year, 0);
    }

    if (medal) {
      this.medal = medalToEnum(medal);
    }
  }

  checkIsNumber(maybeYear) {
    return !isNaN(maybeYear) && !isNaN(parseInt(maybeYear, 0));
  }

  handle() {
    const sql = this.makeMedalsQuery();
    const params = [this.season];

    if (this.year) {
      params.push(this.year);
    }

    if (this.medal) {
      params.unshift(this.medal);
    }

    const results = this.db.prepare(sql).all(params);
    const average = this.getAverage(results);

    if (average < MAX_MEDALS_AVERAGE) {
      return results;
    }

    return this.filterByMaxAverage(results);
  }

  filterByMaxAverage(results) {
    const average = this.getAverage(results);
    return results.filter((item) => {
      return average === MAX_MEDALS_AVERAGE && item.countMedals > MAX_MEDALS_AVERAGE;
    });
  }

  getAverage(results) {
    const sum = results.reduce((sum, current) => sum + current, 0);
    return Math.ceil(sum / results.length);
  }

  makeMedalsQuery() {
    const medalParam = this.medal
      ? `AND results.medal = ?`
      : '';

    const yearParam = this.year
      ? `AND games.year = ?`
      : '';

    return `
    SELECT
      teams.noc_name,
      count(results.id) AS countMedals
    FROM teams
      JOIN athletes ON athletes.team_id = teams.id
      JOIN results ON results.athlete_id = athletes.id ${medalParam}
      JOIN games ON games.id = results.game_id
                    AND games.season = ? ${yearParam}
    GROUP BY teams.noc_name
    ORDER BY countMedals DESC;`;
  }
}

exports.TopTeamsHandler = TopTeamsHandler;
