const Game = require("./model/game");
const Cards = require("./model/cards");
const Player = require("./model/player");
const cards = require("../data/cards");

const initializeGame = function() {
  const bigDeals = new Cards(cards.bigDeals);
  const smallDeals = new Cards(cards.smallDeals);
  const market = new Cards(cards.market);
  const doodads = new Cards(cards.doodads);
  const professions = new Cards(cards.professions);
  return new Game({ bigDeals, smallDeals, market, doodads, professions });
};

const hostGame = function(req, res) {
  const game = initializeGame();
  const { playerName } = req.body;
  const player = new Player(playerName);
  const gameId = res.app.createGameId();
  game.addPlayer(player);
  res.app.games[gameId] = game;
  res.cookie("gameId", gameId);
  res.cookie("playerName", playerName);
  res.redirect("/waiting.html");
};

const provideGameLobby = function(req, res) {
  const players = req.game.getPlayerNames();
  const { gameId } = req.cookies;
  res.send(JSON.stringify({ players, gameId }));
};

const joinGame = function(req, res) {
  const { gameId, playerName } = req.body;
  const player = new Player(playerName);
  const game = res.app.games[gameId];
  game.addPlayer(player);
  res.cookie("gameId", gameId);
  res.cookie("playerName", playerName);
  res.redirect("/waiting.html");
};

const getPlayers = function(req, res) {
  let { name } = req.game.currentPlayer;
  req.game.isMyTurn = name == req.cookies["playerName"];
  res.send(JSON.stringify(req.game.players));
};

const getGame = function(req, res) {
  res.send(JSON.stringify(req.game));
};

module.exports = {
  hostGame,
  provideGameLobby,
  getPlayers,
  joinGame,
  getGame
};
