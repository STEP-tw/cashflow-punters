const { getNextNum, add, randomNum } = require("../utils/utils.js");
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
    this.notification = "";
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
    if (this.childrenCount == 3) {
      return false;
    }
    this.childrenCount += 1;
    this.addExpense("Child Expenses", this.perChildExpense);
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

  reduceCharityTurns() {
    this.charityTurns = this.charityTurns && this.charityTurns - 1;
  }

  rollDice(numberOfDice = 1) {
    const diceValues = new Array(numberOfDice)
      .fill(6)
      .map(value => randomNum(value));
    this.move(diceValues.reduce(add));
    this.rolledDice = true;
    this.didUpdateSpace = true;
    this.reduceCharityTurns();
    return diceValues;
  }

  hasCharityTurns() {
    return this.charityTurns > 0;
  }
}

module.exports = Player;
