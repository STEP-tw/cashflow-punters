const { randomNum } = require("./utils/utils");
const renderHomePage = function(req, res) {
  res.redirect("/homepage.html");
};

const startGame = function(req, res) {
  req.game.getInitialDetails();
  res.redirect("/board.html");
};

const getCurrentGame = function(req, res, next) {
  const { gameId } = req.cookies;
  req.game = res.app.games[gameId];
  next();
};

const logRequest = function(req, res, next) {
  console.log("URL --> ", req.url);
  console.log("Method  --> ", req.method);
  next();
};

const rollDie = function(req, res) {
  let { currentPlayer } = req.game;
  currentPlayer.haveToActivateDice = false;
  currentPlayer.updateSpace = true;
  const diceNumber = randomNum(6);
  const rolledDieMsg = "rolled " + diceNumber;
  currentPlayer.move(diceNumber);
  req.game.updateActivity(currentPlayer, rolledDieMsg);
  res.send("" + diceNumber, 200);
};

module.exports = {
  renderHomePage,
  logRequest,
  startGame,
  rollDie,
  getCurrentGame
};
