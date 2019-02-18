const lodash = require("lodash")
const { range, assignId } = require('../utils/array.js');

class Game {
  constructor(cardStore) {
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

  getInitialDetails() {
    const ids = range(1, this.players.length);
    lodash.zip(this.players,ids).map(assignId);
    this.players.map((player) => {
      const profession = lodash.shuffle(this.cardStore.professions.cards).shift()
      player.profession = profession;
      this.cardStore.professions.usedCard(profession);
    })
  }

  nextPlayer() {
    this.currentPlayer.hasRolledDice = false;
  }
}

module.exports = Game;
