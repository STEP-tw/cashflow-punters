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
    this.bankrupt = false;
    this.bankruptcy = false;
    this.removed = false;
    this.isTurnComplete = true;
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
      let totalDownpayment = 0;
      this.assets.realEstates.forEach(
        realEstate => (totalDownpayment += realEstate.downPayment / 2)
      );
      let newCashflow = this.cashflow + totalDownpayment * 0.1;
      return newCashflow < 0;
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
      this.setNotification("you already have 3 babies so baby is not added");
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

  rollDice(numberOfDice = 1) {
    const diceValues = new Array(numberOfDice).fill(6).map(randomNum);
    this.move(diceValues.reduce(add));
    this.rolledDice = true;
    this.reduceCharityTurns();
    return diceValues;
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
    return true;
  }

  buyGoldCoins(card) {
    const { cost, numberOfCoins } = card;
    if (this.ledgerBalance < cost * numberOfCoins) return false;
    this.deductLedgerBalance(cost * numberOfCoins);
    this.addGoldCoins(+numberOfCoins);
    this.addCreditEvent(cost * numberOfCoins, "bought Gold Coins");
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
  }

  sellShares(card, numberOfShares) {
    const { symbol, currentPrice } = card;
    let price = numberOfShares * currentPrice;
    this.addToLedgerBalance(price);
    this.addCreditEvent(price, ` sold shares of ${symbol}`);
    this.assets.shares[symbol].numberOfShares -= numberOfShares;
    const shareOfCompany = this.assets.shares[symbol].numberOfShares;
    if (shareOfCompany == 0) delete this.assets.shares[symbol];
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
