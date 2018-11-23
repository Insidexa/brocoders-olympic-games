const { choice, validationMessage } = require('../../../src/app/support/messages');

const exampleValues = [1, 2];

describe('messages', () => {
  it('choice text generation case', () => {
    expect(choice('example', exampleValues)).toBe(`example [ 1, 2 ]`);
  });
  it('validation message text generation case', () => {
    const choiceText = choice('example', exampleValues);

    expect(validationMessage(choiceText)).toBe(`Enter ${choiceText}`);
  });
});
