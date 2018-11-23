const { TeamCSV } = require('../../../../src/app/csv/mappers/team-csv');

describe('TeamCSV', () => {
  const exampleTeamCSVArray = [
    null,
    'Team-2234',
    'UKR',
  ];

  const team = new TeamCSV(exampleTeamCSVArray, 1);

  it('should remove dash and numbers at end of the string', () => {
    expect(team.model.name).toBe('Team');
  });
});
