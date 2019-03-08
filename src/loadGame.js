const Game = require("./model/game");
const Cards = require("./model/cards");
const Player = require("./model/player");
const Board = require("./model/board");
const Dice = require("./model/dice");
const { gameSpaces } = require("./constant");

const restoreCards = function (cardStore) {
  const result = {};
  Object.keys(cardStore).forEach(type => {
    const cards = new Cards("");
    Object.assign(cards, cardStore[type]);
    result[type] = cards;
  })
  return result;
}

const restorePlayer = function (game, playerData) {
  const player = new Player(playerData.name);
  Object.assign(player, playerData);
  player.dice = new Dice();
  game.addPlayer(player);
}

const restorePlayers = function (game, gameData) {
  gameData.players.forEach(restorePlayer.bind(null, game));
  gameData.fasttrackPlayers.forEach(restorePlayer.bind(null, game));
}

const restoreBoard = function () {
  return new Board(gameSpaces);
}

const restoreCurrentPlayer = function (game, player) {
  const currentPlayer = game.getPlayerByName(player.name);
  game.setCurrentPlayer(currentPlayer);
}

const restoreActivityLog = function (game, activities) {
  game.activityLog.activityLog = activities.activityLog;
}

const restoreMethods = function (data) {
  const gameData = Object.assign({}, data);
  const cardStore = restoreCards(gameData.cardStore);
  const board = restoreBoard();
  const host = gameData.host;
  const game = new Game(cardStore, board, host);
  game.activeCard = gameData.activeCard;
  game.bankruptedPlayersCount = gameData.bankruptedPlayersCount;
  restorePlayers(game, gameData);
  restoreCurrentPlayer(game, gameData);
  restoreActivityLog(game, gameData.activityLog);
  return game;
}

const restoreGames = function (games) {
  const result = {};
  Object.keys(games).forEach(key => {
    result[key] = restoreMethods(games[key]);
    result[key].setHasLoaded();
  })
  return result;
}

module.exports = { restoreGames };