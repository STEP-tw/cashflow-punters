const { getNextNum, add, randomNum } = require("../utils/utils.js");
const FinancialStatement = require("./financialStatement");
const { CHARITY_MSG } = require("../constant");

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
    this.downSizedForTurns = 0;
  }

  setTurn(turn) {
    this.turn = turn;
  }

  isDownSized() {
    return this.downSizedForTurns != 0;
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
    this.setNotification(CHARITY_MSG);
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
      .map(value => 2 || randomNum(value));
    this.move(diceValues.reduce(add));
    this.rolledDice = true;
    this.reduceCharityTurns();
    return diceValues;
  }

  hasCharityTurns() {
    return this.charityTurns > 0;
  }

  addRealEstate(card) {
    const { downPayment, type, cost, cashflow, mortgage } = card;
    if (this.ledgerBalance < downPayment) return false;
    this.deductLedgerBalance(+downPayment);
    this.addCreditEvent(+downPayment, "brought realEstate");
    this.addAsset(type, downPayment, cost);
    this.addLiability(type, mortgage);
    this.addIncomeRealEstate(type, cashflow);
    return true;
  }

  buyGoldCoins(card) {
    const { cost, numberOfCoins } = card;
    if (this.ledgerBalance < cost * numberOfCoins) return false;
    this.deductLedgerBalance(cost * numberOfCoins);
    this.addGoldCoins(+numberOfCoins);
    this.addCreditEvent(cost * numberOfCoins, "brought gold coins");
    return true;
  }

  setNotification(notification) {
    this.notification = notification;
  }

  doChildExpenses(amount) {
    if (!this.childrenCount) return;
    this.ledgerBalance -= this.childrenCount * amount;
    this.setNotification(
      this.childrenCount * amount + "  deducted from your account"
    );
    return this.childrenCount * amount;
  }
}

module.exports = Player;
