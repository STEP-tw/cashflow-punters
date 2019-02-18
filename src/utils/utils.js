const randomNum = maxNum => Math.ceil(Math.random() * maxNum);

const createGameId = function() {
  const gameId = new Date();
  return gameId.getTime() % 10000;
};

module.exports = {randomNum, createGameId};
