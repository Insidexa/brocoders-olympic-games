const { argumentOrExit } = require('./../support/argument-or-exit');
const {
  checkIsMedal, checkIsSeason, medalToEnum, seasonToEnum,
} = require('./types');
const { SEASON_MSG, MEDAL_MSG, NOC_MSG } = require('./messages');

class MedalsHandler {
  constructor(db, argv) {
    this.db = db;
    this.medal = null;
    const [_maybeSeason, noc, _maybeMedal] = argv;

    // argumentOrExit(_maybeSeason, SEASON_MSG);
    argumentOrExit(noc, NOC_MSG);
    // medal optional
    // argumentOrExit(_maybeMedal, MEDAL_MSG);

    this.initParams(_maybeSeason, noc, _maybeMedal);
  }

  handle() {
    const sql = this.makeMedalsQuery();

    const params = [this.season, this.noc];
    if (this.medal) {
      params.unshift(this.medal);
    }

    const yearsMedals = this.db
      .prepare(sql)
      .all(params);

    console.log(yearsMedals);

    return 1;
  }

  output(results) {
    console.log(results);
  }

  makeMedalsQuery() {
    const medalParam = this.medal
      ? ` AND results.medal = ?`
      : ' AND results.medal > 0';

    return `
    SELECT
      games.year,
      count(results.id) AS countMedals
    FROM teams
      JOIN athletes ON athletes.team_id = teams.id
      JOIN results ON results.athlete_id = athletes.id${medalParam}
      JOIN games ON games.id = results.game_id AND games.season = ?
    WHERE noc_name = ?
    GROUP BY games.year
    ORDER BY games.year`;
  }

  initParams(_maybeSeason, noc, _maybeMedal) {
    const maybeSeason = _maybeSeason.toLowerCase();

    if (typeof _maybeMedal === 'undefined') {
      if (checkIsSeason(maybeSeason)) {
        this.season = seasonToEnum(maybeSeason);
      } else {
        argumentOrExit(undefined, SEASON_MSG.split('or')[0]);
      }
    } else {
      const maybeMedal = _maybeMedal.toLowerCase();
      this.initSeason(maybeSeason, maybeMedal);
      this.initMedal(maybeMedal, maybeSeason);
    }

    this.noc = noc.toUpperCase();
  }

  initSeason(maybeSeason, maybeMedal) {
    const isSeason = checkIsSeason(maybeSeason) || checkIsMedal(maybeSeason);
    if (!isSeason) {
      argumentOrExit(undefined, SEASON_MSG);
    }

    if (checkIsSeason(maybeSeason)) {
      this.season = seasonToEnum(maybeSeason);
    }

    if (checkIsSeason(maybeMedal)) {
      this.season = seasonToEnum(maybeMedal);
    }
  }

  initMedal(maybeMedal, maybeSeason) {
    const isMedal = checkIsMedal(maybeMedal) || checkIsSeason(maybeMedal);
    if (!isMedal) {
      argumentOrExit(undefined, MEDAL_MSG);
    }

    if (checkIsMedal(maybeMedal)) {
      this.medal = medalToEnum(maybeMedal);
    }

    if (checkIsMedal(maybeSeason)) {
      this.medal = medalToEnum(maybeSeason);
    }
  }
}

exports.MedalsHandler = MedalsHandler;
