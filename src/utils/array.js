const assignId = function (element) {
  element[0].turn = element[1];
  return element[0];
}

module.exports = { assignId }