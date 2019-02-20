const { isCurrentPlayer } = require("./gameHandlers");

const { randomNum } = require("./utils/utils");
const renderHomePage = function(req, res) {
  res.redirect("/homepage.html");
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
  if (!isCurrentPlayer(req)) {
    res.send("this is not your turn ", 301);
    return;
  }
  let { currentPlayer } = req.game;
  let currentSpace = currentPlayer.currentSpace;
  currentPlayer.deactivateDice();
  const diceNumber = randomNum(6);
  const rolledDieMsg = " rolled " + diceNumber;
  currentPlayer.move(diceNumber);
  req.game.addActivity(rolledDieMsg, currentPlayer.name);
  res.send("" + diceNumber, 200);
  req.game.handleSpace(currentSpace);
};

module.exports = {
  renderHomePage,
  logRequest,
  rollDie,
  getCurrentGame
};
