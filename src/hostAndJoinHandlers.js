const Game = require("./model/game");
const Cards = require("./model/cards");
const Player = require("./model/player");
const cards = require("../data/cards");
const Board = require("./model/board");
const { gameSpaces } = require("./constant");

const initializeGame = function(host) {
  const bigDeals = new Cards(cards.bigDeals);
  const smallDeals = new Cards(cards.smallDeals);
  const market = new Cards(cards.market);
  const doodads = new Cards(cards.doodads);
  const professions = new Cards(cards.professions);
  const cardsStore = { bigDeals, smallDeals, market, doodads, professions };
  const board = new Board(gameSpaces);
  return new Game(cardsStore, board, host);
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
  if (req.game == undefined) return res.json({ isGamePresent: false });
  const players = req.game.getPlayerNames();
  const { gameId, playerName } = req.cookies;
  const isHost = req.game.host == playerName;
  const hasStarted = req.game.hasStarted;
  res.send(
    JSON.stringify({ players, gameId, isHost, hasStarted, isGamePresent: true })
  );
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

const doesGameExist = function(allGames, gameId) {
  return Object.keys(allGames).includes(gameId);
};

const sendGameNotFound = function(res) {
  const error = "Sorry! No Game with this Id..";
  const isGameJoinable = false;
  res.send(JSON.stringify({ error, isGameJoinable }));
};

const sendGameStarted = function(res) {
  const error = "Sorry! The Game has already started..";
  const isGameJoinable = false;
  res.send(JSON.stringify({ error, isGameJoinable }));
};

const sendPlaceNotAvailable = function(res) {
  const error = "Sorry! No place available in the Game..";
  const isGameJoinable = false;
  res.send(JSON.stringify({ error, isGameJoinable }));
};

const canJoin = function(req, res) {
  const { gameId } = req.body;
  const allGames = res.app.games;
  const game = allGames[gameId];
  if (!doesGameExist(allGames, gameId)) return sendGameNotFound(res);
  const hasStarted = game.hasStarted;
  const isPlaceAvailable = game.isPlaceAvailable();

  if (hasStarted) return sendGameStarted(res);
  if (!isPlaceAvailable) return sendPlaceNotAvailable(res);

  res.send(JSON.stringify({ isGameJoinable: true }));
};

const cancelGame = function(req, res) {
  const { gameId } = req.cookies;
  delete res.app.games[gameId];
  res.clearCookie("playerName");
  res.clearCookie("gameId");
  res.end();
};

module.exports = {
  canJoin,
  hostGame,
  joinGame,
  cancelGame,
  provideGameLobby
};
