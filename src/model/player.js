const { getNextNum } = require("../utils/utils.js");
class Player {
  constructor(name) {
    this.name = name;
    this.profession;
    this.financialStatement;
    this.currentSpace = 0;
    this.turn;
  }
  setTurn(turn) {
    this.turn = turn;
  }
  move(spacesCount) {
    this.currentSpace = getNextNum(this.currentSpace, 24, spacesCount);
    return this.currentSpace;
  }
  getTurn() {
    return this.turn;
  }
}

module.exports = Player;
