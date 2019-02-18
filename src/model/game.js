const lodash = require("lodash")

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
    this.players.map((player, index) => {
      let profession = lodash.shuffle(this.cardStore.professions.cards).shift()
      player.gamePiece = index + 1;
      player.turn = index + 1;
      player.profession = profession;
      this.cardStore.professions.usedCard(profession);
    })
  }
  
  nextPlayer() {
    this.currentPlayer.hasRolledDice = false;
  }
}

module.exports = Game;
