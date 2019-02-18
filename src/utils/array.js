const range = function (initialIndex, endIndex) {
  let range = [];
  for (let index = initialIndex; index <= endIndex; index++) {
    range.push(index);
  }
  return range;
}

const assignId = function (element) {
  element[0].turn = element[1];
  return element[0];
}

module.exports = { range, assignId }