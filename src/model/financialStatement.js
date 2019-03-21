const { add, hasIntersection, isEqual } = require("../utils/utils.js");
const CashLedger = require("./cashLedger");
const getIncome = (value, content) => value + content.cashflow;

class FinancialStatement extends CashLedger {
  constructor() {
    super();
    this.cashflowDayIncome;
    this.profession;
    this.passiveIncome = 0;
    this.totalExpense;
    this.totalIncome;
    this.cashflow;
    this.ledgerBalance;
    this.income;
    this.expenses;
    this.liabilities;
    this.assets;
    this.perChildExpense;
    this.businessInvestments = [];
    this.cashflowGoal;
    this.isFasttrackPlayer = false;
  }

  updateTotalIncome() {
    const assetIncome = this.income.realEstates.reduce(getIncome, 0);
    this.totalIncome = assetIncome + this.income.salary;
  }

  updateTotalExpense() {
    this.totalExpense = Object.values(this.expenses).reduce(add);
  }

  updateCashFlow() {
    this.cashflow = this.totalIncome - this.totalExpense;
  }

  updateFinancialStatement() {
    this.updateTotalExpense();
    this.updateTotalIncome();
    this.updateCashFlow();
  }

  setFinancialStatement(profession) {
    this.profession = profession.profession;
    this.perChildExpense = profession.perChildExpense;
    this.income = profession.income;
    this.income.realEstates = [];
    this.assets = profession.assets;
    this.assets.shares = {};
    this.assets.goldCoins = 0;
    this.assets.realEstates = [];
    this.expenses = profession.expenses;
    this.liabilities = profession.liabilities;
    this.liabilities.realEstates = [];
    this.liabilities["Bank Loan"] = 0;
    this.updateFinancialStatement();
    const initialAmount = this.cashflow + profession.assets.savings;
    this.ledgerBalance = initialAmount;
    this.addCreditEvent(initialAmount, "Initial Cash");
  }

  addToLedgerBalance(amount) {
    this.ledgerBalance += amount;
  }

  deductLedgerBalance(amount) {
    this.ledgerBalance -= amount;
  }

  addPayday() {
    this.addToLedgerBalance(this.cashflow);
    this.addCreditEvent(this.cashflow, "got payday");
    return this.cashflow;
  }

  addExpense(expense, amount) {
    if (this.expenses[expense]) {
      this.expenses[expense] += amount;
      return;
    }
    this.expenses[expense] = amount;
    this.updateFinancialStatement();
  }

  addGoldCoins(count) {
    this.assets.goldCoins += count;
  }

  addAsset(card) {
    this.assets.realEstates.push(card);
  }

  removeAsset(estate) {
    const assets = this.assets;
    assets.realEstates = assets.realEstates.filter(
      realEstate => !isEqual(realEstate, estate)
    );
  }

  removeRealEstateLiability(estate) {
    const liabilities = this.liabilities;
    liabilities.realEstates = liabilities.realEstates.filter(
      realEstate => !isEqual(realEstate, estate)
    );
  }

  removeIncomeRealEstate(estate) {
    const income = this.income;
    income.realEstates = income.realEstates.filter(
      realEstate => !isEqual(realEstate, estate)
    );
  }

  addLiability(liability, amount) {
    if (this.liabilities[liability]) {
      this.liabilities[liability] += amount;
      this.addToLedgerBalance(amount);
      return;
    }
    this.liabilities[liability] = amount;
    this.addToLedgerBalance(amount);
  }

  addRealEstateLiability(card) {
    this.liabilities.realEstates.push(card);
  }

  addIncomeRealEstate(card) {
    this.income.realEstates.push(card);
    this.passiveIncome += card.cashflow;
    this.updateTotalIncome();
    this.updateCashFlow();
  }

  sellEstate(estate, marketCard) {
    const profit = this.calculateProfit(estate, marketCard);
    this.removeAsset(estate);
    this.addCreditEvent(profit, " sold Real Estate");
    this.addToLedgerBalance(profit);
    this.removeIncomeRealEstate(estate);
    this.removeRealEstateLiability(estate);
    return estate.mortgage + profit;
  }

  removeLiability(liability, amount) {
    this.liabilities[liability] -= amount;
    this.deductLedgerBalance(amount);
  }

  removeExpense(expense, amount) {
    this.expenses[expense] -= amount;
  }

  calculateProfit(estate, marketCard) {
    const { cash, percentage } = marketCard.data;
    const { mortgage, cost } = estate;
    if (cash) return cost + cash - mortgage;
    return (1 + percentage / 100) * cost - mortgage;
  }

  getRealEstatesType() {
    return this.liabilities.realEstates.map(estate => estate.type);
  }

  sellGoldCoins(numberOfCoins, cost) {
    const totalAmout = numberOfCoins * cost;
    this.assets.goldCoins -= numberOfCoins;
    this.addToLedgerBalance(totalAmout);
    this.addCreditEvent(totalAmout, ` Sold ${numberOfCoins} gold coins.`);
    this.setNotification(
      `You sold ${numberOfCoins} gold coins at rate of ${cost}.$${totalAmout} added to your Ledger Balance`
    );
  }

  removeRealState(asset) {
    const incomeRealEstats = this.income.realEstates;
    const realEstateLiability = this.liabilities.realEstates;
    const realEstateAssets = this.assets.realEstates;
    const indexNo = incomeRealEstats.indexOf(asset);
    incomeRealEstats.splice(indexNo, 1);
    realEstateLiability.splice(indexNo, 1);
    realEstateAssets.splice(indexNo, 1);
  }

  getDownPayment(asset) {
    const refundableAmount = asset.downPayment / 2;
    this.addToLedgerBalance(refundableAmount);
    this.removeRealState(asset);
    return refundableAmount;
  }

  removeHalfShares(symbol) {
    const shares = this.assets.shares[symbol];
    const numberOfShares = shares.numberOfShares;
    this.setNotification(`Your ${symbol} shares got halved.`);
    shares.numberOfShares = Math.ceil(numberOfShares / 2);
  }

  doubleShares(symbol) {
    const shares = this.assets.shares[symbol];
    const numberOfShares = shares.numberOfShares;
    this.setNotification(`Your ${symbol} shares got doubled.`);
    shares.numberOfShares = numberOfShares * 2;
  }

  hasRealEstate(realEstatesType) {
    return hasIntersection(this.getRealEstatesType(), realEstatesType);
  }

  hasGoldCoins() {
    return this.assets.goldCoins > 0;
  }

  hasShares(symbol) {
    return this.assets.shares.hasOwnProperty(symbol);
  }

  hasEscaped() {
    let notification =
      "Your Passive income has became greater than expenses, to escape from Rat race bank loan needs to be paid.";
    if (this.passiveIncome >= this.totalExpense && !this.isFasttrackPlayer) {
      if (this.liabilities["Bank Loan"] < this.ledgerBalance) {
        notification = "Congrats!! You are out of Rat race.";
        this.setNotification(notification);
        return true;
      }
      this.setNotification(notification);
    }
    return false;
  }
}

module.exports = FinancialStatement;
