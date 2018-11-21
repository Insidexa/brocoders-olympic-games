class Athlete {
	constructor(full_name, sex, yearOfBirth, params, teamId) {
		this.full_name = full_name;
		this.sex = sex;
		this.year_of_birth = yearOfBirth;
		this.params = params || { height: null, width: null };
		this.team_id = teamId;
	}
}

exports.Athlete = Athlete;