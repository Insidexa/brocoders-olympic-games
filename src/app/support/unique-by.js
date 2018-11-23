function uniqueBy(arr, fn) {
  const uniqueKey = {};
  const uniques = [];

  arr.forEach((item) => {
    const value = fn(item);
    if (!uniqueKey[value]) {
      uniqueKey[value] = true;
      uniques.push(item);
    }
  });

  return uniques;
}

exports.uniqueBy = uniqueBy;
