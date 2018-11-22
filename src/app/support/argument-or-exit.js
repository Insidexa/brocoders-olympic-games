function argumentOrExit(value, text) {
  if (value) {
    return true;
  }

  console.log(text);
  process.exit(1);
}

exports.argumentOrExit = argumentOrExit;
