const { getNextNum } = require("../utils/utils.js");
class Player {
  constructor(name) {
    this.name = name;
    this.profession;
    this.financialStatement;
    this.currentSpace = 0;
    this.turn;
    this.haveToActivateDice;
    this.didUpdateSpace = false;
  }
  setTurn(turn) {
    this.turn = turn;
  }
  move(spacesCount) {
    this.currentSpace = getNextNum(this.currentSpace, 24, spacesCount);
    this.didUpdateSpace = true;
    return this.currentSpace;
  }
  getTurn() {
    return this.turn;
  }
  activateDice() {
    this.haveToActivateDice = true;
  }
  deactivateDice() {
    this.haveToActivateDice = false;
  }
}

module.exports = Player;
