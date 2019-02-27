const _ = require("lodash");

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

const add = function(firstNum, secondNum) {
  return firstNum + secondNum;
};

const isSame = function(firstArg, secondArg) {
  return firstArg == secondArg;
};

const calculateLoanToTake = function(ledgerBalance) {
  return Math.ceil(Math.abs(ledgerBalance) / 1000) * 1000;
};

const hasIntersection = function(list1, list2) {
  return _.intersection(list1, list2).length > 0;
};

const isEqual = function(entity1, entity2) {
  return _.isEqual(entity1, entity2);
};

module.exports = {
  randomNum,
  createGameId,
  getNextNum,
  isBetween,
  add,
  isSame,
  calculateLoanToTake,
  hasIntersection,
  isEqual
};
