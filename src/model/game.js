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

  nextPlayer() {
    this.currentPlayer.hasRolledDice = false;
  }
}

module.exports = Game;
