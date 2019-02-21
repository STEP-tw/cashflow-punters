const { getNextNum } = require("../utils/utils.js");
const FinancialStatement = require("./financialStatement");

class Player extends FinancialStatement {
  constructor(name) {
    super();
    this.name = name;
    this.profession;
    this.currentSpace = 0;
    this.charityTurns = 0;
    this.turn;
    this.childrenCount = 0;
    this.didUpdateSpace = false;
    this.charityTurns = 0;
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

  addBaby() {
    this.childrenCount += 1;
  }

  addCharityTurn() {
    this.charityTurns = 3;
    this.ledgerBalance = this.ledgerBalance - this.totalIncome * 0.1;
  }

  getLedgerBalance() {
    return this.ledgerBalance;
  }

  isAbleToDoCharity() {
    return this.ledgerBalance >= this.totalIncome * 0.1;
  }
}

module.exports = Player;
