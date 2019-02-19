const lodash = require("lodash");
const { range, assignId } = require("../utils/array.js");
const { getNextNum } = require("../utils/utils.js");

class Game {
  constructor(cardStore, host) {
    this.host = host;
    this.cardStore = cardStore;
    this.currentPlayer;
    this.players = [];
    this.gameLog = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayerNames() {
    return this.players.map(player => player.name);
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  getInitialDetails() {
    const ids = range(1, this.players.length);
    lodash.zip(this.players, ids).map(assignId);
    this.players.map(player => {
      const profession = lodash
        .shuffle(this.cardStore.professions.cards)
        .shift();
      player.profession = profession;
      this.cardStore.professions.usedCard(profession);
    });
    this.currentPlayer = this.players[0];
  }

  getPlayer(turn) {
    return this.players[turn - 1];
  }

  getTotalPlayers() {
    return this.players.length;
  }

  nextPlayer() {
    const currTurn = this.currentPlayer.getTurn();
    const nextPlayerTurn = getNextNum(currTurn, this.getTotalPlayers());
    const nextPlayer = this.getPlayer(nextPlayerTurn);
    this.currentPlayer = nextPlayer;
    this.currentPlayer.haveToActivateDice = true;
  }
}

module.exports = Game;
