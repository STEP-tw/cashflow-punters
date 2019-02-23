const randomNum = maxNum => Math.ceil(Math.random() * maxNum);

const getNextNum = (currNum, lastNum, next = 1) =>
  (currNum + next) % lastNum || lastNum;

const createGameId = function() {
  const gameId = new Date();
  return gameId.getTime() % 10000;
};

const isBetween = function(lowerLimit, upperLimit, number) {
  return number < upperLimit && number > lowerLimit;
};

const add = function(sum, value) {
  return sum + value;
};

const isSame = function(firstArg, secondArg) {
  return firstArg == secondArg;
};

const calculateLoanToTake = function(ledgerBalance) {
  return Math.ceil(Math.abs(ledgerBalance) / 1000) * 1000;
};

module.exports = {
  randomNum,
  createGameId,
  getNextNum,
  isBetween,
  add,
  isSame,
  calculateLoanToTake
};
