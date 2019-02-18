const {randomNum} = require('./utils/utils');

const getCurrentGame = function(req, res, next) {
  const {gameId} = req.cookies;
  req.game = res.app.games[gameId];
  next();
};

const renderHomePage = function(req, res) {
  res.redirect('/homepage.html');
};

const logRequest = function(req, res, next) {
  console.log('URL --> ', req.url);
  console.log('Method  --> ', req.method);
  next();
};

const rollDie = function(req, res) {
  let {currPlayer} = req.game;
  let diceNumber = randomNum(6);
  let rolledDieMsg = 'rolled ' + diceNumber;
  currPlayer.move(diceNumber);
  req.game.updateActivity(currPlayer, rolledDieMsg);
  res.send('' + diceNumber, 200);
};

const startGame = function(req, res) {
  res.redirect('/board.html');
};

module.exports = {
  renderHomePage,
  logRequest,
  startGame,
  rollDie,
  getCurrentGame
};
