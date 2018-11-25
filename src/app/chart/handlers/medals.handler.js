const { argumentOrError } = require('../../support/argument-or-exit');
const {
  checkIsMedal, checkIsSeason, medalToEnum, seasonToEnum,
} = require('../../support/types');
const { SEASON_MSG, MEDAL_MSG, NOC_MSG } = require('../../support/messages');

class MedalsHandler {
  constructor(db, argv) {
    this.headerName = 'Year';
    this.db = db;
    this.medal = null;
    const [_maybeSeason, noc, _maybeMedal] = argv;

    this.initParams(_maybeSeason, noc, _maybeMedal);
  }

  handle() {
    const sql = this.makeMedalsQuery();

    const params = [this.season, this.noc];
    if (this.medal) {
      params.push(this.medal);
    }

    return this.db.prepare(sql).all(params);
  }

  makeMedalsQuery() {
    const medalParam = this.medal
      ? `WHERE results.medal = ?`
      : 'WHERE results.medal > 0'; // not calculate when medal not exists

    return `
      SELECT
        games.year,
        count(results.id) AS countMedals
      FROM games
        LEFT JOIN (
                    SELECT * FROM results
                      JOIN games ON games.id = results.game_id AND games.season = ?
                      JOIN athletes ON athletes.id = results.athlete_id
                      JOIN teams ON teams.id = athletes.team_id AND teams.noc_name = ?
                    ${medalParam}
                  ) AS results ON results.game_id = games.id
      GROUP BY games.year
      ORDER BY games.year;`;
  }

  initParams(_maybeSeason, noc, _maybeMedal) {
    const maybeSeason = _maybeSeason.toLowerCase();

    if (typeof _maybeMedal === 'undefined') {
      argumentOrError(_maybeSeason, SEASON_MSG);
      if (checkIsSeason(maybeSeason)) {
        this.season = seasonToEnum(maybeSeason);
      } else {
        argumentOrError(undefined, SEASON_MSG);
      }
    } else {
      const maybeMedal = _maybeMedal.toLowerCase();
      this.initSeason(maybeSeason, maybeMedal);
      this.initMedal(maybeMedal, maybeSeason);
    }

    argumentOrError(noc, NOC_MSG);
    this.noc = noc.toUpperCase();
  }

  initSeason(maybeSeason, maybeMedal) {
    const isSeason = checkIsSeason(maybeSeason) || checkIsSeason(maybeMedal);
    if (!isSeason) {
      argumentOrError(undefined, SEASON_MSG);
    }

    if (checkIsSeason(maybeSeason)) {
      this.season = seasonToEnum(maybeSeason);
    }

    if (checkIsSeason(maybeMedal)) {
      this.season = seasonToEnum(maybeMedal);
    }
  }

  initMedal(maybeMedal, maybeSeason) {
    const isMedal = checkIsMedal(maybeMedal) || checkIsMedal(maybeSeason);
    if (!isMedal) {
      argumentOrError(undefined, MEDAL_MSG);
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
