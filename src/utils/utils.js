const randomNum = maxNum => Math.ceil(Math.random() * maxNum);

const getNextNum = (currNum, lastNum, next = 1) =>
  (currNum + next) % lastNum || lastNum;

const createGameId = function() {
  const gameId = new Date();
  return gameId.getTime() % 10000;
};

module.exports = { randomNum, createGameId, getNextNum };
