// eslint-disable-next-line consistent-return
function argumentOrExit(value, text) {
  if (value) {
    return true;
  }

  console.log(text);
  process.exit(1);
}

exports.argumentOrExit = argumentOrExit;
