// eslint-disable-next-line consistent-return
function argumentOrError(value, text) {
  if (typeof value !== 'undefined') {
    return true;
  }

  throw new Error(text);
}

exports.argumentOrError = argumentOrError;
