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

module.exports = { randomNum, createGameId, getNextNum, isBetween };
