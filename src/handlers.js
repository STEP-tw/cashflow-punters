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
  let { currentPlayer } = req.game;
  currentPlayer.deactivateDice();
  const diceNumber = randomNum(6);
  const rolledDieMsg = "rolled " + diceNumber;
  currentPlayer.move(diceNumber);
  req.game.addActivity(currentPlayer.name, rolledDieMsg);
  res.send("" + diceNumber, 200);
  req.game.nextPlayer();
};

module.exports = {
  renderHomePage,
  logRequest,
  rollDie,
  getCurrentGame
};
