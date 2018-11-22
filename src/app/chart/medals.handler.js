const { argumentOrExit } = require('./../support/argument-or-exit');
const { TYPE_MEDAL } = require('./../../models/Result');
const { TYPE_SEASON } = require('./../../models/Game');

const SEASONS = Object.keys(TYPE_SEASON).map(season => season.toLowerCase());
const MEDALS = Object.keys(TYPE_MEDAL)
  .filter(medal => medal !== 'NA').map(medal => medal.toLowerCase());

const SEASONS_STR = SEASONS.join(', ');
const MEDALS_STR = MEDALS.join(', ');

const SEASON_MSG = `Enter season [ ${SEASONS_STR} ] or medal [ ${MEDALS_STR} ]`;
const MEDAL_MSG = `Enter medal [ ${MEDALS_STR} ] or season [ ${SEASONS_STR} ]`;
const NOC_MSG = `Enter NOC name`;

class MedalsHandler {
  constructor(argv) {
    this.medal = null;
    const [_maybeSeason, noc, _maybeMedal] = argv;

    argumentOrExit(_maybeSeason, SEASON_MSG);
    argumentOrExit(noc, NOC_MSG);
    // medal optional
    // argumentOrExit(_maybeMedal, MEDAL_MSG);

    this.initParams(_maybeSeason, noc, _maybeMedal);
  }

  handle() {
  }

  initParams(_maybeSeason, noc, _maybeMedal) {
    const maybeSeason = _maybeSeason.toLowerCase();

    if (typeof _maybeMedal === 'undefined') {
      this.season = _maybeSeason;
    } else {
      const maybeMedal = _maybeMedal.toLowerCase();
      this.initSeason(maybeSeason, maybeMedal);
      this.initMedal(maybeMedal, maybeSeason);
    }

    this.noc = noc;
  }

  initSeason(maybeSeason, maybeMedal) {
    const isSeason = this.checkIsSeason(maybeSeason) || this.checkIsMedal(maybeSeason);
    if (!isSeason) {
      argumentOrExit(undefined, SEASON_MSG);
    }

    if (this.checkIsSeason(maybeSeason)) {
      this.season = maybeSeason;
    }

    if (this.checkIsSeason(maybeMedal)) {
      this.season = maybeMedal;
    }
  }

  initMedal(maybeMedal, maybeSeason) {
    const isMedal = this.checkIsMedal(maybeMedal) || this.checkIsSeason(maybeMedal);
    if (!isMedal) {
      argumentOrExit(undefined, MEDAL_MSG);
    }

    if (this.checkIsMedal(maybeMedal)) {
      this.medal = maybeMedal;
    }

    if (this.checkIsMedal(maybeSeason)) {
      this.medal = maybeSeason;
    }
  }

  checkIsMedal(maybeMedal) {
    return MEDALS.includes(maybeMedal);
  }

  checkIsSeason(maybeSeason) {
    return SEASONS.includes(maybeSeason);
  }
}

exports.MedalsHandler = MedalsHandler;
