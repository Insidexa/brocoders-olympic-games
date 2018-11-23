// eslint-disable-next-line consistent-return
function argumentOrExit(value, text) {
  if (typeof value !== 'undefined') {
    return true;
  }

  console.log(text);
  process.exit(1);
}

exports.argumentOrExit = argumentOrExit;
