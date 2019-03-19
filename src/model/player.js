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
    this.bankrupted = false;
    this.isTurnComplete = true;
    this.notifyEscape = false;
    this.dice = new Dice();
    this.hasMLM = false;
    this.MLMProfit = 0;
    this.MLMCardsCount = 0;
    this.MLMTurns = 0;
    this.hasLeftGame = false;
  }

  setTurn(turn) {
    this.turn = turn;
  }

  isBankruptcy() {
    return this.cashflow < 0 && this.ledgerBalance < -this.cashflow;
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

  move(spacesCount, spaces = 24) {
    this.currentSpace = getNextNum(this.currentSpace, spaces, spacesCount);
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
    this.rolledDice = true;
    this.reduceCharityTurns();
    this.oldSpaceNo = this.currentSpace;
    const diceValues = this.rollDie(numberOfDice);
    let spaces = 24;
    if (this.isFasttrackPlayer) spaces = 40;
    if (this.currentSpace == null) {
      const fasttrackIntialSpaces = [1, 7, 14, 21, 27, 34];
      this.currentSpace = fasttrackIntialSpaces[this.dice.total() - 1];
      return diceValues;
    }
    this.move(this.dice.total(), spaces);
    return diceValues;
  }

  rollDie(numberOfDice = 1) {
    return this.dice.roll(numberOfDice);
  }

  hasCharityTurns() {
    return this.charityTurns > 0;
  }

  addRealEstate(card) {
    const { downPayment, type } = card;
    if (this.ledgerBalance < downPayment) return false;
    this.deductLedgerBalance(downPayment);
    this.addDebitEvent(downPayment, "bought Real Estate");
    this.addAsset(card);
    this.addRealEstateLiability(card);
    this.addIncomeRealEstate(card);
    this.setNotification(`You bought ${type} for $${downPayment}`);
    return true;
  }

  buyGoldCoins(card) {
    const { cost, numberOfCoins } = card;
    if (this.ledgerBalance < cost) return false;
    this.deductLedgerBalance(cost);
    this.addGoldCoins(+numberOfCoins);
    this.addDebitEvent(cost, `bought ${numberOfCoins} Gold Coins`);
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
    this.setNotification(
      `You bought ${numberOfShares} shares of ${symbol} for $${price}`
    );
    if (!this.assets.shares[symbol]) {
      this.assets.shares[symbol] = {};
      this.assets.shares[symbol].numberOfShares = 0;
    }
    this.assets.shares[symbol].numberOfShares += numberOfShares;
    this.assets.shares[symbol].currentPrice = currentPrice;
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

  addMLM(card) {
    const { cost } = card;
    this.hasMLM = true;
    this.MLMProfit = cost;
    this.MLMCardsCount += 1;
    this.deductLedgerBalance(cost);
    this.setNotification("You bought MLM card");
    this.addDebitEvent(cost, "bought MLM card");
    return true;
  }

  addMLMProfit() {
    const profit = this.MLMProfit;
    this.addToLedgerBalance(profit);
    this.addCreditEvent(profit, "got MLM profit");
    this.setNotification(`You got $${profit} as MLM profit `);
  }

  incrementMLMTurns() {
    this.MLMTurns += 1;
  }

  isMLMTurnLeft() {
    return this.MLMTurns < this.MLMCardsCount;
  }

  removeMLMTurn() {
    this.MLMTurns = 0;
  }

  rollDiceForMLM() {
    this.rollDie();
    this.incrementMLMTurns();
    const isMLMTurnLeft = this.isMLMTurnLeft();
    const diceValue = this.dice.total();
    if (diceValue < 4) {
      this.addMLMProfit();
      return { gotMLM: true, diceValue, isMLMTurnLeft };
    }
    this.setNotification("you didn't get MLM profit");
    return { gotMLM: false, diceValue, isMLMTurnLeft };
  }

  removeAllShares() {
    this.assets.shares = {};
    this.addCreditEvent(0, " sold all shares");
  }

  getBusinessDeal(card) {
    const { downPayment, title, cashflow } = card;
    if (!this.isCapableToPay(downPayment)) {
      this.setNotification("Don't have enough balance to invest");
      return false;
    }
    this.deductLedgerBalance(downPayment);
    this.addCreditEvent(downPayment, `Invested in ${card.title}`);
    this.setNotification(`You invested ${downPayment} in ${title}`);
    this.cashflowDayIncome += cashflow;
    this.businessInvestments.push(card);
    return true;
  }

  addCashFlow() {
    this.addToLedgerBalance(this.cashflowDayIncome);
    this.addCreditEvent(this.cashflowDayIncome, `Added monthly cashflow`);
    this.setNotification(
      `You landed on cashflow. $${this.cashflowDayIncome} added to your Savings`
    );
  }

  hasWon() {
    return this.cashflowDayIncome >= this.cashflowGoal;
  }

  issuePenalty(card) {
    const amount = this.ledgerBalance / 2;
    this.ledgerBalance -= amount;
    this.addDebitEvent(amount, ` Due to ${card.title} you paid `);
  }

  enterIntoFasttrack() {
    this.isFasttrackPlayer = true;
    this.cashflowDayIncome = this.passiveIncome * 100;
    this.cashflowGoal = this.cashflowDayIncome + 50000;
  }
}

module.exports = Player;
