const { getNextNum } = require("../utils/utils.js");
const FinancialStatement = require("./financialStatement");
const { CHARITY_MSG } = require("../constant");
const Dice = require("./dice");

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
    this.bankrupt = false;
    this.bankruptcy = false;
    this.removed = false;
    this.isTurnComplete = true;
    this.notifyEscape = false;
    this.dice = new Dice();
  }

  setTurn(turn) {
    this.turn = turn;
  }

  isBankruptcy() {
    return this.cashflow < 0 && this.ledgerBalance + this.cashflow < 0;
  }

  isBankrupted() {
    if (this.isBankruptcy()) {
      if (this.assets.realEstates.length == 0) {
        return true;
      }
    }
    return false;
  }

  removeCharityEffect() {
    this.charityTurns = 0;
  }

  isDownSized() {
    return this.downSizedForTurns != 0;
  }

  downSizeTurns() {
    return this.downSizedForTurns;
  }

  isLedgerBalanceNegative() {
    return this.ledgerBalance < 0;
  }

  downsize() {
    this.downSizedForTurns = 2;
    const downSizePenalty = this.totalExpense;
    this.ledgerBalance -= downSizePenalty;
    const eventMsg = "Downsize Penalty";
    this.addDebitEvent(downSizePenalty, eventMsg);
  }

  decrementDownSizeTurns() {
    this.downSizedForTurns -= 1;
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
      this.setNotification("You already have 3 babies so baby is not added");
      return false;
    }
    this.childrenCount += 1;
    this.addExpense("Child Expenses", this.perChildExpense);
  }

  addCharityTurn() {
    this.charityTurns = 3;
    const charityAmount = this.totalIncome * 0.1;
    this.ledgerBalance -= charityAmount;
    this.addDebitEvent(charityAmount, "Charity");
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

  rollDiceAndMove(numberOfDice) {
    const diceValues = this.rollDie(numberOfDice);
    this.move(this.dice.total());
    this.rolledDice = true;
    this.reduceCharityTurns();
    return diceValues;
  }

  rollDie(numberOfDice = 1) {
    return this.dice.roll(numberOfDice);
  }

  hasCharityTurns() {
    return this.charityTurns > 0;
  }

  addRealEstate(card) {
    const { downPayment, type, cost, cashflow, mortgage, title } = card;
    if (this.ledgerBalance < downPayment) return false;
    this.deductLedgerBalance(downPayment);
    this.addDebitEvent(downPayment, "bought Real Estate");
    this.addAsset(title, type, downPayment, cost);
    this.addRealEstateLiability(title, type, mortgage);
    this.addIncomeRealEstate(title, type, cashflow);
    this.setNotification(`You bought ${type} for $${downPayment}`);
    return true;
  }

  buyGoldCoins(card) {
    const { cost, numberOfCoins } = card;
    if (this.ledgerBalance < cost) return false;
    this.deductLedgerBalance(cost);
    this.addGoldCoins(+numberOfCoins);
    this.addCreditEvent(cost, `bought ${numberOfCoins} Gold Coins`);
    this.setNotification(`You bought ${numberOfCoins} Gold Coins for $${cost}`);
    return true;
  }

  setNotification(notification) {
    this.notification = notification;
  }

  getChildCount() {
    return this.childrenCount;
  }

  hasChild() {
    return this.childrenCount > 0;
  }

  buyShares(card, numberOfShares) {
    const { symbol, currentPrice } = card;
    const price = numberOfShares * currentPrice;
    this.deductLedgerBalance(price);
    this.addDebitEvent(price, ` brought shares of ${symbol}`);
    this.assets.shares[symbol] = { numberOfShares, currentPrice };
    this.setNotification(
      `You bought ${numberOfShares} shares of ${symbol} for $${price}`
    );
  }

  sellShares(card, numberOfShares) {
    const { symbol, currentPrice } = card;
    let price = numberOfShares * currentPrice;
    this.addToLedgerBalance(price);
    this.addCreditEvent(price, ` sold shares of ${symbol}`);
    this.assets.shares[symbol].numberOfShares -= numberOfShares;
    const shareOfCompany = this.assets.shares[symbol].numberOfShares;
    if (shareOfCompany == 0) delete this.assets.shares[symbol];
    this.setNotification(
      `You sold ${numberOfShares} shares of ${symbol} for $${price}`
    );
  }

  isCapableToPay(amount) {
    return this.ledgerBalance >= amount;
  }

  isCapableToSell(symbol, numberOfShares) {
    return this.assets.shares[symbol].numberOfShares >= numberOfShares;
  }

  completeTurn() {
    this.isTurnComplete = true;
  }

  holdTurn() {
    this.isTurnComplete = false;
  }
}

module.exports = Player;
