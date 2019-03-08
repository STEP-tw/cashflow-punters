const Game = require("./model/game");
const Cards = require("./model/cards");
const Player = require("./model/player");
const cards = require("../data/cards");
const Board = require("./model/board");
const {
  gameSpaces,
  NOT_A_PLAYER_TO_LOAD,
  NOT_A_PLAYER
} = require("./constant");

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
  game.incJoinedPlayerCount();
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
  const { gameId, playerName, action } = req.body;
  const validator = { join: canJoin, load: canLoad };
  const reqData = validator[action](req, res);
  const { isAble, loaded } = reqData;
  if (!isAble) return res.json(reqData);
  const game = res.app.games[gameId];
  if (loaded == undefined) {
    const player = new Player(playerName);
    game.addPlayer(player);
  }
  game.incJoinedPlayerCount();
  res.cookie("gameId", gameId);
  res.cookie("playerName", playerName);
  res.json({ isAble: true, url: "/waiting.html" });
};

const doesGameExist = function(allGames, gameId) {
  return Object.keys(allGames).includes(gameId);
};

const sendGameNotFound = function() {
  const error = "Sorry! No Game with this Id..";
  const isAble = false;
  return { error, isAble };
};

const sendGameStarted = function() {
  const error = "Sorry! The Game has already started..";
  const isAble = false;
  return { error, isAble };
};

const sendPlaceNotAvailable = function() {
  const error = "Sorry! No place available in the Game..";
  const isAble = false;
  return { error, isAble };
};

const sendCannotJoinError = function() {
  return { isAble: false, error: NOT_A_PLAYER };
};

const isAbleToJoinSavedGame = function(req, res) {
  const { gameId, playerName } = req.body;
  const allGames = res.app.games;
  const game = allGames[gameId];
  if (!isPlayerPresent(game, playerName)) return sendCannotJoinError();
  return { isAble: true, loaded: true };
};

const canJoin = function(req, res) {
  const { gameId } = req.body;
  const allGames = res.app.games;
  const savedGames = res.app.savedGames;
  const game = allGames[gameId];
  if (!doesGameExist(allGames, gameId)) return sendGameNotFound();
  if (doesGameExist(savedGames, gameId)) return isAbleToJoinSavedGame(req, res);
  const hasStarted = game.hasStarted;
  const isPlaceAvailable = game.isPlaceAvailable();

  if (hasStarted) return sendGameStarted();
  if (!isPlaceAvailable) return sendPlaceNotAvailable();

  return { isAble: true };
};

const cancelGame = function(req, res) {
  const { gameId } = req.cookies;
  delete res.app.games[gameId];
  res.clearCookie("playerName");
  res.clearCookie("gameId");
  res.end();
};

const isPlayerPresent = function(game, playerName) {
  return game.players.some(({ name }) => playerName == name);
};

const sendCannotLoadError = function() {
  return { isAble: false, error: NOT_A_PLAYER_TO_LOAD };
};

const canLoad = function(req, res) {
  const { gameId, playerName } = req.body;
  const savedGames = res.app.savedGames;
  if (!doesGameExist(savedGames, gameId)) return sendGameNotFound(res);
  if (!isPlayerPresent(savedGames[gameId], playerName))
    return sendCannotLoadError();
  res.app.games[gameId] = savedGames[gameId];
  return { isAble: true, loaded: true };
};

module.exports = {
  canJoin,
  hostGame,
  joinGame,
  cancelGame,
  provideGameLobby
};
