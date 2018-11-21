class Athlete {
  constructor(fullName, sex, yearOfBirth, params, teamId) {
    this.full_name = fullName;
    this.sex = sex;
    this.year_of_birth = yearOfBirth;
    this.params = params || { height: null, width: null };
    this.team_id = teamId;
  }
}

exports.Athlete = Athlete;
