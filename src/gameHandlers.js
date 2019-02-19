const Game = require("./model/game");
const Cards = require("./model/cards");
const Player = require("./model/player");
const cards = require("../data/cards");

const initializeGame = function(host) {
  const bigDeals = new Cards(cards.bigDeals);
  const smallDeals = new Cards(cards.smallDeals);
  const market = new Cards(cards.market);
  const doodads = new Cards(cards.doodads);
  const professions = new Cards(cards.professions);
  return new Game({ bigDeals, smallDeals, market, doodads, professions }, host);
};

const hostGame = function(req, res) {
  const { playerName } = req.body;
  const game = initializeGame(playerName);
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
  const { gameId, playerName } = req.cookies;
  const isHost = req.game.host == playerName;
  const hasStarted = req.game.hasStarted;
  res.send(JSON.stringify({ players, gameId, isHost, hasStarted }));
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

const startGame = function(req, res) {
  req.game.getInitialDetails();
  req.game.hasStarted = true;
  res.redirect("/board.html");
};

const canJoin = function(req, res) {
  const { gameId } = req.body;
  const game = res.app.games[gameId];
  const hasStarted = game.hasStarted;
  const isPlaceAvailable = game.isPlaceAvailable();
  res.send(JSON.stringify({ hasStarted, isPlaceAvailable }));
};

const getPlayers = function(req, res) {
  let { name } = req.game.currentPlayer;
  req.game.isMyTurn = name == req.cookies["playerName"];
  res.send(JSON.stringify(req.game.players));
};

const getGame = function(req, res) {
  let { name } = req.game.currentPlayer;
  req.game.isMyTurn = name == req.cookies["playerName"];
  res.send(JSON.stringify(req.game));
};

module.exports = {
  hostGame,
  provideGameLobby,
  getPlayers,
  joinGame,
  getGame,
  startGame,
  canJoin
};
